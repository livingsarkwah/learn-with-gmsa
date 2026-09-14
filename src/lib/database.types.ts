export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          created_at?: string;
        };
      };
      colleges: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
      };
      programs: {
        Row: { id: string; college_id: string | null; name: string; created_at: string };
        Insert: { id?: string; college_id?: string | null; name: string; created_at?: string };
        Update: { id?: string; college_id?: string | null; name?: string; created_at?: string };
      };
      courses: {
        Row: {
          id: string;
          code: string;
          title: string;
          level: number;
          created_at: string;
          program_id: string;
          semester: number;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          level: number;
          created_at?: string;
          program_id: string;
          semester: number;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          level?: number;
          created_at?: string;
          program_id?: string;
          semester?: number;
        };
      };
      categories: {
        Row: { id: string; name: string; member_only: boolean; created_at: string };
        Insert: { id?: string; name: string; member_only: boolean; created_at?: string };
        Update: { id?: string; name?: string; member_only?: boolean; created_at?: string };
      };
      resource_collections: {
        Row: { id: string; name: string; created_at: string; sort_order: string };
        Insert: { id?: string; name: string; created_at?: string; sort_order?: string };
        Update: { id?: string; name?: string; created_at?: string; sort_order?: string };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category_id: string;
          course_id: string | null;
          resource_type: string;
          file_url: string;
          tags: string[] | null;
          download_count: number;
          collection_id: string | null;
          file_name: string | null;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category_id: string;
          course_id?: string | null;
          resource_type: string;
          file_url: string;
          tags?: string[] | null;
          download_count?: number;
          collection_id?: string | null;
          file_name?: string | null;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category_id?: string;
          course_id?: string | null;
          resource_type?: string;
          file_url?: string;
          tags?: string[] | null;
          download_count?: number;
          collection_id?: string | null;
          file_name?: string | null;
          created_at?: string;
          status?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
