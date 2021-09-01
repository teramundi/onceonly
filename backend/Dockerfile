#
# BASE
#
FROM python:3.8-slim as base

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1


#
# PYTHON-DEPS
#
FROM base AS python-deps

# Install pipenv and compilation dependencies
RUN pip install pipenv
RUN apt-get update && apt-get install -y --no-install-recommends gcc

# Install python dependencies in /.venv
COPY Pipfile .
COPY Pipfile.lock .
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy

#
# RUNTIME
#
FROM base AS runtime

# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Create new user
RUN useradd --create-home onceonly

# Switch workdir
WORKDIR /home/onceonly

# Install application into container
COPY . .

# Fix ownership
RUN chown onceonly:onceonly /home/onceonly/data

# Switch to new user
USER onceonly

# Create data volume
VOLUME ["/home/onceonly/data"]

# Run the application
ENTRYPOINT ["./run.sh"]
