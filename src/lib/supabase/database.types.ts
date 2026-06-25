export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// Hand-maintained to match supabase/migrations/001_init.sql. Generated columns
// (products.fts) are omitted; they're never selected through the typed client.

export type ProductStatus = 'active' | 'draft' | 'pre_order' | 'sold_out'
export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type CouponType = 'percent' | 'fixed'
export type UserRole = 'customer' | 'affiliate' | 'admin'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          parent_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          parent_id?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          brand: string
          category: string
          category_id: string | null
          description: string
          short_description: string
          price: number
          original_price: number | null
          cost_price: number | null
          image: string
          images: string[]
          flavors: string[] | null
          nicotine_strengths: number[] | null
          tags: string[]
          puff_count: number | null
          ml_size: number | null
          featured: boolean
          status: ProductStatus
          sku: string | null
          inventory_qty: number
          in_stock: boolean
          weight_lbs: number | null
          length_in: number | null
          width_in: number | null
          height_in: number | null
          specs: Json
          meta_title: string | null
          meta_description: string | null
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          slug: string
          name: string
          category: string
          price: number
          brand?: string
          category_id?: string | null
          description?: string
          short_description?: string
          original_price?: number | null
          cost_price?: number | null
          image?: string
          images?: string[]
          flavors?: string[] | null
          nicotine_strengths?: number[] | null
          tags?: string[]
          puff_count?: number | null
          ml_size?: number | null
          featured?: boolean
          status?: ProductStatus
          sku?: string | null
          inventory_qty?: number
          in_stock?: boolean
          weight_lbs?: number | null
          length_in?: number | null
          width_in?: number | null
          height_in?: number | null
          specs?: Json
          meta_title?: string | null
          meta_description?: string | null
          rating?: number
          review_count?: number
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: UserRole
          avatar_url: string | null
          referral_code: string | null
          referred_by: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          referral_code?: string | null
          referred_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string | null
          status: OrderStatus
          subtotal: number
          shipping_amount: number
          discount_amount: number
          tax_amount: number
          total: number
          coupon_code: string | null
          address: Json | null
          billing_address: Json | null
          tracking_number: string | null
          carrier: string | null
          notes: string | null
          stripe_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          total: number
          order_number?: string
          user_id?: string | null
          email?: string | null
          status?: OrderStatus
          subtotal?: number
          shipping_amount?: number
          discount_amount?: number
          tax_amount?: number
          coupon_code?: string | null
          address?: Json | null
          billing_address?: Json | null
          tracking_number?: string | null
          carrier?: string | null
          notes?: string | null
          stripe_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_image: string | null
          sku: string | null
          quantity: number
          price: number
          selected_flavor: string | null
          selected_nicotine: number | null
        }
        Insert: {
          order_id: string
          product_name: string
          quantity: number
          price: number
          product_id?: string | null
          product_image?: string | null
          sku?: string | null
          selected_flavor?: string | null
          selected_nicotine?: number | null
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      coupons: {
        Row: {
          id: string
          code: string
          type: CouponType
          value: number
          min_order_value: number
          max_uses: number | null
          uses_count: number
          expires_at: string | null
          is_active: boolean
          user_id: string | null
          created_at: string
        }
        Insert: {
          code: string
          value: number
          type?: CouponType
          min_order_value?: number
          max_uses?: number | null
          uses_count?: number
          expires_at?: string | null
          is_active?: boolean
          user_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          reviewer_name: string
          rating: number
          title: string | null
          body: string
          status: ReviewStatus
          created_at: string
        }
        Insert: {
          product_id: string
          reviewer_name: string
          rating: number
          user_id?: string | null
          title?: string | null
          body?: string
          status?: ReviewStatus
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      affiliates: {
        Row: {
          id: string
          user_id: string | null
          code: string
          commission_rate: number
          clicks: number
          total_referrals: number
          total_earned: number
          total_paid: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          code: string
          user_id?: string | null
          commission_rate?: number
          clicks?: number
          total_referrals?: number
          total_earned?: number
          total_paid?: number
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['affiliates']['Insert']>
      }
      affiliate_referrals: {
        Row: {
          id: string
          affiliate_id: string
          order_id: string | null
          commission: number
          status: string
          created_at: string
        }
        Insert: {
          affiliate_id: string
          order_id?: string | null
          commission?: number
          status?: string
        }
        Update: Partial<Database['public']['Tables']['affiliate_referrals']['Insert']>
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: { user_id: string; product_id: string }
        Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>
      }
      search_logs: {
        Row: {
          id: string
          query: string
          results_count: number
          user_id: string | null
          created_at: string
        }
        Insert: {
          query: string
          results_count?: number
          user_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['search_logs']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string
          cover_image: string | null
          author: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          slug: string
          title: string
          excerpt?: string | null
          content?: string
          cover_image?: string | null
          author?: string | null
          published_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      newsletter_subscribers: {
        Row: { id: string; email: string; created_at: string }
        Insert: { email: string }
        Update: Partial<{ email: string }>
      }
    }
    Enums: {
      product_status: ProductStatus
      order_status: OrderStatus
      coupon_type: CouponType
      user_role: UserRole
      review_status: ReviewStatus
    }
  }
}
