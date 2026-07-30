"""add user roles

Revision ID: 834beca3703a
Revises: faf1aedd5d84
Create Date: 2026-07-24 10:11:07.071159

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from app.models.user import UserRole

# revision identifiers, used by Alembic.
revision: str = '834beca3703a'
down_revision: Union[str, Sequence[str], None] = 'faf1aedd5d84'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    user_role = sa.Enum(UserRole, name="userrole")

    user_role.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "users",
        sa.Column(
            "role",
            user_role,
            nullable=False,
            server_default="EMPLOYEE"
        )
    )


def downgrade() -> None:
    op.drop_column("users", "role")

    user_role = sa.Enum(UserRole, name="userrole")

    user_role.drop(op.get_bind(), checkfirst=True)