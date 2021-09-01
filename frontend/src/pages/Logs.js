import { useEffect, useState } from "react"
import { API_URL } from '../constants'

const emptyFilter = {
  offset: 0,
  limit: 20,
  action: '',
  secret_subject: '',
  client_address: '',
  client_user_agent: '',
  start_date: '',
  end_date: '',
}

function Logs() {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState(null)
  const [filter, setFilter] = useState(emptyFilter)

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const fetchLogs = async () => {
    setLoading(true)
    const url = new URL(`${API_URL}/logs`)
    const params = Object.entries(filter).filter(e => !!e[1])
    url.search = new URLSearchParams(params).toString();
    const resp = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      }
    })
    setLoading(false)
    if (resp.ok) {
      const result = await resp.json()
      setLogs(result)
    }
  }

  const prevPage = (e) => {
    e.preventDefault()
    if (filter.offset <= 0) {
      return
    }
    setFilter({
      ...filter,
      offset: filter.offset - filter.limit
    })
  }

  const nextPage = (e) => {
    e.preventDefault()
    if (logs.length < filter.limit) {
      return
    }
    setFilter({
      ...filter,
      offset: filter.offset + filter.limit
    })
  }

  return (
    <div className="container-fluid">
      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {logs !== null && (
        <div>
          <form className="mb-4">
            <div className="row">
              <div className="col-auto">
                <select
                  className="form-select"
                  value={filter.action}
                  onChange={e => setFilter({ ...filter, action: e.target.value })}>
                  <option value="">Action</option>
                  <option value="ADD">ADD</option>
                  <option value="VIEW">VIEW</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>
              <div className="col-auto">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Start date"
                  value={filter.start_date}
                  onChange={e => setFilter({ ...filter, start_date: e.target.value })} />
              </div>
              <div className="col-auto">
                <input
                  type="date"
                  className="form-control"
                  placeholder="End date"
                  value={filter.end_date}
                  onChange={e => setFilter({ ...filter, end_date: e.target.value })} />
              </div>
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  value={filter.secret_subject}
                  onChange={e => setFilter({ ...filter, secret_subject: e.target.value })} />
              </div>
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="IP"
                  value={filter.client_address}
                  onChange={e => setFilter({ ...filter, client_address: e.target.value })} />
              </div>
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="User-Agent"
                  value={filter.client_user_agent}
                  onChange={e => setFilter({ ...filter, client_user_agent: e.target.value })} />
              </div>
            </div>
          </form>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Action</th>
                <th>Private key</th>
                <th>Subject</th>
                <th>Created at</th>
                <th>Expires in</th>
                <th>IP</th>
                <th>User-Agent</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>{log.password}</td>
                  <td>{log.secret_subject}</td>
                  <td>{log.secret_created_at}</td>
                  <td>{log.secret_expires_in}</td>
                  <td>{log.client_address}</td>
                  <td>{log.client_user_agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${filter.offset <= 0 ? 'disabled' : ''}`}>
                <a
                  href="#prev"
                  className="page-link"
                  disabled={filter.offset <= 0}
                  onClick={prevPage}>
                  Previous
                </a>
              </li>
              <li className={`page-item ${logs.length < filter.limit ? 'disabled' : ''}`}>
                <a
                  href="#next"
                  className="page-link"
                  disabled={logs.length < filter.limit}
                  onClick={nextPage}>
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Logs
