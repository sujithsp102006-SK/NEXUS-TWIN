import asyncio
from sqlalchemy import text
from app.database.session import engine

async def test_connection():
    try:
        async with engine.connect() as connection:
            result = await connection.execute(
                text("SELECT DATABASE(), USER()")
            )

            print("\nDATABASE CONNECTION SUCCESSFUL!")
            print("Database and User:", result.fetchone())

    except Exception as e:
        print("\nDATABASE CONNECTION FAILED!")
        print(e)

    finally:
        await engine.dispose()


asyncio.run(test_connection())