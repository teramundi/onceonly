from datetime import datetime
from typing import List, Generic, TypeVar, Optional
from sqlalchemy.orm import Session
from app.models import Secret, Log


T = TypeVar('T')


class Repository(Generic[T]):

    def __init__(self, db: Session) -> None:
        self.db = db

    def entity_class(self) -> T:
        raise Exception('Not implemented')


    def get_by_id(self, id: int) -> Optional[T]:
        entity = self.entity_class()
        return self.db\
            .query(entity)\
            .filter(entity.id == id).first()


    def get_all(
        self,
        offset: int=0,
        limit: int=100,
        action: str = None,
        secret_subject: str = None,
        client_address: str = None,
        client_user_agent: datetime = None,
        start_datetime: datetime = None,
        end_datetime: datetime = None,
    ) -> List[T]:
        print(start_datetime)
        print(end_datetime)
        entity = self.entity_class()
        query = self.db\
            .query(entity)\
            .order_by(entity.id.desc())
        if action:
            query = query.filter(entity.action == action)
        if secret_subject:
            query = query.filter(entity.secret_subject.like("%{}%".format(secret_subject)))
        if client_address:
            query = query.filter(entity.client_address.like("%{}%".format(client_address)))
        if client_user_agent:
            query = query.filter(entity.client_user_agent.like("%{}%".format(client_user_agent)))
        if start_datetime:
            query = query.filter(entity.created_at >= start_datetime)
        if end_datetime:
            query = query.filter(entity.created_at <= end_datetime)
        return query\
            .offset(offset)\
            .limit(limit)\
            .all()


    def save(self, model: T) -> T:
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return model


    def remove(self, model: T) -> None:
        self.db.delete(model)
        self.db.commit()


class SecretRepository(Repository[Secret]):

    def entity_class(self) -> Secret:
        return Secret

    def get_by_passwd_hash(self, passwd_hash: str) -> Optional[Secret]:
        return self.db.query(Secret).filter(Secret.passwd_hash == passwd_hash).first()


class LogRepository(Repository[Log]):

    def entity_class(self) -> Log:
        return Log