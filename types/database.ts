export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string
          full_name: string | null
          email: string
          phone_number: string | null
          profile_picture: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          full_name?: string | null
          email: string
          phone_number?: string | null
          profile_picture?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          full_name?: string | null
          email?: string
          phone_number?: string | null
          profile_picture?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          description: string
          long_description: string | null
          price: number
          images: string[]
          category: string
          location: Json
          rating: number
          review_count: number
          items: Json
          check_in_info: Json
          transportation: Json
          accessibility: Json
          additional_info: Json
          schedules: Json
          date_start: string | null
          date_end: string | null
          company: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          long_description?: string | null
          price: number
          images: string[]
          category: string
          location: Json
          rating?: number
          review_count?: number
          items?: Json
          check_in_info?: Json
          transportation?: Json
          accessibility?: Json
          additional_info?: Json
          schedules?: Json
          date_start?: string | null
          date_end?: string | null
          company?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          long_description?: string | null
          price?: number
          images?: string[]
          category?: string
          location?: Json
          rating?: number
          review_count?: number
          items?: Json
          check_in_info?: Json
          transportation?: Json
          accessibility?: Json
          additional_info?: Json
          schedules?: Json
          date_start?: string | null
          date_end?: string | null
          company?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          experience_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          experience_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          experience_id?: string
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          experience_id: string
          booking_reference: string
          check_in_date: string
          check_out_date: string
          room_type: string
          guest_count: number
          total_price: number
          status: 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          experience_id: string
          booking_reference: string
          check_in_date: string
          check_out_date: string
          room_type: string
          guest_count?: number
          total_price: number
          status?: 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          experience_id?: string
          booking_reference?: string
          check_in_date?: string
          check_out_date?: string
          room_type?: string
          guest_count?: number
          total_price?: number
          status?: 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}