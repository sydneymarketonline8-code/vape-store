export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          name: string
          brand: string
          category: 'disposables' | 'mods' | 'e-liquids' | 'accessories'
          price: number
          original_price: number | null
          image: string
          images: string[]
          description: string
          short_description: string
          flavors: string[] | null
          nicotine_strengths: number[] | null
          in_stock: boolean
          featured: boolean
          rating: number
          review_count: number
          tags: string[]
          puff_count: number | null
          ml_size: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          selected_flavor: string | null
          selected_nicotine: number | null
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wishlist_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>
      }
    }
  }
}
