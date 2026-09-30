"""Random account data generator.

Generates records like:

    {
      "email": "k3v9xq2mfa7t@gmail.com",
      "password": "aB3$dE5^gH7*jK9!",
      "random": "qwertyuiop,asdfghjklz"
    }

Uses the ``secrets`` module so values are cryptographically random.

Usage (CLI):
    python account_generator.py            # one record
    python account_generator.py -n 5       # five records as a JSON array
"""

import argparse
import json
import secrets
import string

EMAIL_DOMAIN = "gmail.com"
EMAIL_NAME_LENGTH = 12
PASSWORD_LENGTH = 16
FIELD_LENGTH = 10

LOWER = string.ascii_lowercase
UPPER = string.ascii_uppercase
DIGITS = string.digits
SPECIAL = "!@#$%^&*()-_=+[]{}?"


def random_lowercase(length: int = FIELD_LENGTH) -> str:
    """Return a string of random lowercase letters."""
    return "".join(secrets.choice(LOWER) for _ in range(length))


def generate_email(length: int = EMAIL_NAME_LENGTH, domain: str = EMAIL_DOMAIN) -> str:
    """Return ``{emailname}@{domain}``; the name starts with a letter, then letters/digits."""
    name = secrets.choice(LOWER) + "".join(
        secrets.choice(LOWER + DIGITS) for _ in range(length - 1)
    )
    return f"{name}@{domain}"


def generate_password(length: int = PASSWORD_LENGTH) -> str:
    """Return a password guaranteed to contain lowercase, uppercase, digit and special chars."""
    pools = [LOWER, UPPER, DIGITS, SPECIAL]
    if length < len(pools):
        raise ValueError(f"length must be at least {len(pools)}")
    chars = [secrets.choice(pool) for pool in pools]
    all_chars = "".join(pools)
    chars += [secrets.choice(all_chars) for _ in range(length - len(pools))]
    secrets.SystemRandom().shuffle(chars)
    return "".join(chars)


def generate_record() -> dict:
    """Return one record: email, password and ``{10 lowercase},{10 lowercase}``."""
    return {
        "email": generate_email(),
        "password": generate_password(),
        "random": f"{random_lowercase()},{random_lowercase()}",
    }


def generate_json(count: int = 1, indent: int = 2) -> str:
    """Return ``count`` records as JSON (an object if count == 1, else an array)."""
    records = [generate_record() for _ in range(count)]
    return json.dumps(records[0] if count == 1 else records, indent=indent)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate random account data as JSON.")
    parser.add_argument("-n", "--count", type=int, default=1, help="number of records")
    args = parser.parse_args()
    print(generate_json(max(1, args.count)))


if __name__ == "__main__":
    main()
