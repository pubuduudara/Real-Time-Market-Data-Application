# Real-Time Market Data Application

This repository contains the codebase for a real-time crypto market data application that fetches and displays financial market information. The application is powered by Node.JS, PostgreSQL and integrates with Tiingo and Alpha Vantage APIs for live data.

## Setup

Follow these steps to set up and run the application locally:

### 1. Clone the Repository

```bash
# Clone the repository to your local machine
git clone https://github.com/pubuduudara/Real-Time-Market-Data-Application.git

cd Real-Time-Market-Data-Application
#run
npm install
```

### 2. Use `.env` File in the project root

Create a `.env` file in the root of the project and add the following configuration:

```plaintext
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=market-data
DB_PORT=5441
API_PORT=3000
CRYPTO_TIINGO_WEB_SOCKET=wss://api.tiingo.com/crypto
TINGO_AUTH_KEY=
VALID_API_KEYS=abcd
```

#### Configuration Details:

- **Database Configuration:**

  - `DB_HOST`: The hostname of your PostgreSQL database (e.g., `localhost`).
  - `DB_USERNAME`: Your PostgreSQL username (e.g., `postgres`).
  - `DB_PASSWORD`: Your PostgreSQL password.
  - `DB_NAME`: The name of the PostgreSQL database (e.g., `market-data`).
  - `DB_PORT`: The port PostgreSQL is running on (default: `5441`).

- **API Configuration:**

  - `CRYPTO_TIINGO_WEB_SOCKET`: The WebSocket URL for Tiingo's crypto API (`wss://api.tiingo.com/crypto`).
  - `TINGO_AUTH_KEY`: Obtain your authentication key from [Tiingo](https://www.tiingo.com/).

- **Authentication Configuration:**
- `VALID_API_KEYS`: Comma-separated list of valid API keys for authenticating requests. (Note: this should be passed in each REST API header. use `x-api-key` as the header key)

### 3. Obtain API Keys

#### Tiingo API Key:

1. Visit [Tiingo](https://www.tiingo.com/).
2. Sign up or log in to your account.
3. Generate an API key and update the `TINGO_AUTH_KEY` field in the `.env` file.

### 4. Create a PostgreSQL Database

1. Install PostgreSQL if it’s not already installed.
2. Open your terminal and log in to PostgreSQL:

   ```bash
   psql -U postgres
   ```

3. Create a database:

   ```sql
   CREATE DATABASE "market-data";
   ```

4. Ensure the credentials (`DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`) match those in your `.env` file.

### 5. Set Up Database Tables

Run the following SQL commands to create the necessary tables:

```sql
CREATE TABLE public."CryptoTrades" (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	ticker varchar NOT NULL,
	"timeStamp" timestamptz NOT NULL,
	exchange varchar NOT NULL,
	"lastSize" float8 NOT NULL,
	"lastPrice" float8 NOT NULL,
	CONSTRAINT deferred_sync_assets_and_exchanges TRIGGER DEFERRABLE INITIALLY DEFERRED,
	CONSTRAINT newtable_pk PRIMARY KEY (id)
);

CREATE TABLE public."Exchanges" (
	id uuid NOT NULL,
	"name" varchar NOT NULL,
	createdat timestamp NOT NULL DEFAULT now(),
	CONSTRAINT exchanges_pk PRIMARY KEY (id),
	CONSTRAINT exchanges_un UNIQUE (name)
);

CREATE TABLE public."CryptoAssets" (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	ticker varchar NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT now(),
	CONSTRAINT cryptoassets_pk PRIMARY KEY (id),
	CONSTRAINT cryptoassets_un UNIQUE (ticker)
);

```

### 6. Set Up Triggers and Stored Procedures

Run the following SQL commands to create necessary triggers and stored procedures:

```sql
CREATE OR REPLACE FUNCTION sync_assets_and_exchanges()
RETURNS TRIGGER AS $$
BEGIN
    -- Sync CryptoAssets
    IF NOT EXISTS (
        SELECT 1 FROM public."CryptoAssets" WHERE ticker = NEW.ticker
    ) THEN
        INSERT INTO public."CryptoAssets" (ticker)
        VALUES (NEW.ticker);
    END IF;

    -- Sync Exchanges
    IF NOT EXISTS (
        SELECT 1 FROM public."Exchanges" WHERE name = NEW.exchange
    ) THEN
        INSERT INTO public."Exchanges" (id, name)
        VALUES (gen_random_uuid(), NEW.exchange);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE CONSTRAINT TRIGGER deferred_sync_assets_and_exchanges
AFTER INSERT ON public."MarketTrades"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION sync_assets_and_exchanges();
```

## Project Structure

The project is structured as follows:

- **`src/`**: Contains the source code.
  - **`main.feed.ts`**: Script to consume data from the Tiingo crypto WebSocket. Use `npm run run:feed` to execute.
  - **`main.rest.ts`**: Script to expose REST APIs for fetching data. Use `npm run run:rest` to execute.

## Commands

The following commands can be executed from the terminal:

- `npm run run:feed`: When executed, the application will start consuming crypto market data from the Tiingo WebSocket. First, the data will be buffered and periodically saved in the CryptoTrades table. Thereafter, using stored procedures and deferred triggers, the data will be normalized to the Exchanges and CryptoAssets tables respectively. Additionally, at this time, the application will start sending real-time data to the connected frontend clients via WebSockets.t the following Python code when running the process to simulate how a frontend client will connect and consume data:

use below commands to run it in the terminal (name frontendclinet.py)

- `pip install websocket-client`
- `python frontendclinet.py`

```python
import websocket
import json

def on_open(ws):
    print("Connected to the WebSocket broadcaster.")

def on_message(ws, message):
    try:
        data = json.loads(message)
        print("Received data:", data)
    except json.JSONDecodeError:
        print("Received invalid JSON:", message)

def on_close(ws, close_status_code, close_msg):
    print("Disconnected from WebSocket broadcaster.")

def on_error(ws, error):
    print("WebSocket error:", error)

if __name__ == "__main__":
    ws_url = "ws://localhost:8080"

    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(
        ws_url,
        on_open=on_open,
        on_message=on_message,
        on_close=on_close,
        on_error=on_error,
    )

    try:
        ws.run_forever()
    except KeyboardInterrupt:
        print("Closing WebSocket connection.")
```

- `npm run run:rest`: Starts the REST API server for data access. Once the REST API server is running you can view the API documentation via `http://localhost:3000/api-docs/`. You can execute APIs from the swagger portal. First authorize the API by clicking the Authorize button (set x-api-key in the header). Then you can use the API from the portal itself
- `npm run test:unit`: Executes unit test cases
- `npm run test:integration`: Executes integration test cases
- `npm run test`: Executes all test cases

## Design Considerations

The design of the application incorporates separate processes for different functionalities to leverage Node.js effectively. Here are the key considerations:

1. **Separate Run Commands**:

   - Node.js operates on a single-threaded event loop, making it susceptible to blocking if multiple intensive tasks run within the same process.
   - To avoid such blocking, separate processes are designed for each key operation:
     - `npm run run:feed`: Fetches real-time crypto market data, stores it in the database, and streams it to the frontend via a dedicated WebSocket connection in real-time.
     - `npm run run:rest`: Exposes REST APIs for retrieving crypto market data.
   - This separation ensures high performance, scalability, and responsiveness by isolating tasks into manageable units.

2. **Triggers and Stored Procedures**:

   - The application leverages PostgreSQL triggers and stored procedures to automate data synchronization and enforce data consistency:
     - **Trigger:** Automatically syncs new entries in the `MarketTrades` table with the `CryptoAssets` and `Exchanges` tables.
     - **Stored Procedure:** Handles the logic to check for existing records and inserts missing data, ensuring that the database remains consistent without manual intervention.

3. **Batch Processing with Buffering and Scheduled Saves**:

   - When consuming data from the Tiingo crypto WebSocket, the application employs a buffering mechanism to collect incoming data over a short period.
   - This buffered data is then saved to the database in batches at scheduled intervals.
   - Batch processing reduces the frequency of database write operations, enhancing performance and reducing the risk of bottlenecks.

4. **API Key Authentication**:
   - The application secures API endpoints using an API key-based authentication mechanism.
   - Valid API keys are configured via the VALID_API_KEYS environment variable.
   - This approach ensures only authorized clients can access the application, enhancing security and preventing unauthorized usage.
