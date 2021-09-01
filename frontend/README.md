# onceonly frontend

Single page application, API client.


## About

The onceonly frontend is written using [React library](https://reactjs.org/) to build the user interface and API client.


## Requirements

- Node
- NPM


## Installing

```
npm install
```


## Configuring

Below we see all environment variables required to start the backend:

- **REACT_APP_API_URL**: The backend API URL (without dash at end)
- **REACT_APP_RECAPTCHA_KEY**: The reCaptcha v3 public key

We can also create a `.env.local` file at frontend root directory to define these variables:

```
REACT_APP_API_URL=https://onceon.ly
REACT_APP_RECAPTCHA_KEY=<recaptcha-public-key>
```


## Running

When developing we can just run the built-in server:

```
npm run start
```


## Testing

*TODO*
