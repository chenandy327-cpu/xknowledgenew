from supabase import create_client, Client
from app.core.config import settings
import sys

class MockSupabaseClient:
    def table(self, table_name):
        return MockTable(table_name)

class MockTable:
    def __init__(self, table_name):
        self.table_name = table_name
    
    def select(self, *args):
        return self
    
    def eq(self, *args):
        return self
    
    def order(self, *args, **kwargs):
        return self
    
    def limit(self, *args):
        return self
    
    def offset(self, *args):
        return self
    
    def insert(self, *args):
        return self
    
    def update(self, *args):
        return self
    
    def delete(self, *args):
        return self
    
    def execute(self):
        return MockExecuteResult()

class MockResponse:
    def execute(self):
        return MockExecuteResult()

class MockExecuteResult:
    def __init__(self):
        self.data = []

class SupabaseService:
    def __init__(self):
        try:
            self.supabase: Client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
        except Exception as e:
            print(f"Supabase initialization failed: {e}")
            print("Using mock Supabase client for testing")
            self.supabase = MockSupabaseClient()
    
    def get_client(self):
        return self.supabase

# Create a singleton instance
supabase_service = SupabaseService()
