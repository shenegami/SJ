export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: 'Admin' | 'HR' | 'Manager' | 'Employee';
        };
        Insert: Database['public']['Tables']['roles']['Row'];
        Update: Database['public']['Tables']['roles']['Row'];
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          full_name: string | null;
          role: 'Admin' | 'HR' | 'Manager' | 'Employee';
          is_active: boolean;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          email: string;
          full_name?: string | null;
          role?: 'Admin' | 'HR' | 'Manager' | 'Employee';
          is_active?: boolean;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'Admin' | 'HR' | 'Manager' | 'Employee';
          is_active?: boolean;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_role_fkey';
            columns: ['role'];
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          manager_id: string | null;
          status: 'active' | 'archived';
          start_date: string | null;
          due_date: string | null;
          progress: number | null;
          tags: string[] | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          manager_id?: string | null;
          status?: 'active' | 'archived';
          start_date?: string | null;
          due_date?: string | null;
          progress?: number | null;
          tags?: string[] | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          manager_id?: string | null;
          status?: 'active' | 'archived';
          start_date?: string | null;
          due_date?: string | null;
          progress?: number | null;
          tags?: string[] | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'projects_manager_id_fkey';
            columns: ['manager_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          assignee_id: string | null;
          status: 'todo' | 'in_progress' | 'blocked' | 'done' | 'deferred';
          priority: 'low' | 'normal' | 'high' | 'urgent' | null;
          due_date: string | null;
          progress: number | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          title: string;
          description?: string | null;
          assignee_id?: string | null;
          status?: 'todo' | 'in_progress' | 'blocked' | 'done' | 'deferred';
          priority?: 'low' | 'normal' | 'high' | 'urgent' | null;
          due_date?: string | null;
          progress?: number | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          title?: string;
          description?: string | null;
          assignee_id?: string | null;
          status?: 'todo' | 'in_progress' | 'blocked' | 'done' | 'deferred';
          priority?: 'low' | 'normal' | 'high' | 'urgent' | null;
          due_date?: string | null;
          progress?: number | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_assignee_id_fkey';
            columns: ['assignee_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      attachments: {
        Row: {
          id: string;
          entity_type: 'project' | 'task' | 'policy';
          entity_id: string;
          file_path: string;
          mime_type: string | null;
          uploaded_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          entity_type: 'project' | 'task' | 'policy';
          entity_id: string;
          file_path: string;
          mime_type?: string | null;
          uploaded_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          entity_type?: 'project' | 'task' | 'policy';
          entity_id?: string;
          file_path?: string;
          mime_type?: string | null;
          uploaded_by?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      policies: {
        Row: {
          id: string;
          title: string;
          category: string | null;
          is_active: boolean | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          category?: string | null;
          is_active?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string | null;
          is_active?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'policies_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      policy_versions: {
        Row: {
          id: string;
          policy_id: string | null;
          version: number;
          storage_path: string;
          parsed_text: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          policy_id?: string | null;
          version: number;
          storage_path: string;
          parsed_text?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          policy_id?: string | null;
          version?: number;
          storage_path?: string;
          parsed_text?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'policy_versions_policy_id_fkey';
            columns: ['policy_id'];
            referencedRelation: 'policies';
            referencedColumns: ['id'];
          },
        ];
      };
      salary_sources: {
        Row: {
          id: string;
          title: string;
          storage_path: string;
          parsed_schema: Json | null;
          is_active: boolean | null;
          uploaded_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          storage_path: string;
          parsed_schema?: Json | null;
          is_active?: boolean | null;
          uploaded_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          storage_path?: string;
          parsed_schema?: Json | null;
          is_active?: boolean | null;
          uploaded_by?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'salary_sources_uploaded_by_fkey';
            columns: ['uploaded_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      salary_entries: {
        Row: {
          id: string;
          source_id: string | null;
          job_title: string | null;
          grade: string | null;
          step: string | null;
          base_min: number | null;
          base_max: number | null;
          allowance: Json | null;
          exp_years_min: number | null;
          exp_years_max: number | null;
        };
        Insert: {
          id?: string;
          source_id?: string | null;
          job_title?: string | null;
          grade?: string | null;
          step?: string | null;
          base_min?: number | null;
          base_max?: number | null;
          allowance?: Json | null;
          exp_years_min?: number | null;
          exp_years_max?: number | null;
        };
        Update: {
          id?: string;
          source_id?: string | null;
          job_title?: string | null;
          grade?: string | null;
          step?: string | null;
          base_min?: number | null;
          base_max?: number | null;
          allowance?: Json | null;
          exp_years_min?: number | null;
          exp_years_max?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'salary_entries_source_id_fkey';
            columns: ['source_id'];
            referencedRelation: 'salary_sources';
            referencedColumns: ['id'];
          },
        ];
      };
      documents: {
        Row: {
          id: string;
          source_type: 'policy' | 'salary' | 'other';
          source_id: string | null;
          title: string | null;
          language: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          source_type: 'policy' | 'salary' | 'other';
          source_id?: string | null;
          title?: string | null;
          language?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          source_type?: 'policy' | 'salary' | 'other';
          source_id?: string | null;
          title?: string | null;
          language?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      document_chunks: {
        Row: {
          id: string;
          document_id: string | null;
          chunk_index: number;
          content: string;
          embedding: number[];
          metadata: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          document_id?: string | null;
          chunk_index: number;
          content: string;
          embedding: number[];
          metadata?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          document_id?: string | null;
          chunk_index?: number;
          content?: string;
          embedding?: number[];
          metadata?: Json | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'document_chunks_document_id_fkey';
            columns: ['document_id'];
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity: string | null;
          entity_id: string | null;
          details: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity?: string | null;
          entity_id?: string | null;
          details?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity?: string | null;
          entity_id?: string | null;
          details?: Json | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_actor_id_fkey';
            columns: ['actor_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
  };
}
