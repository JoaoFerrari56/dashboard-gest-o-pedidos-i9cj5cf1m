import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { toast } from 'sonner'

export type Order = Database['public']['Tables']['orders']['Row']

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => {
              // Avoid duplicates if we already optimistic-inserted
              if (prev.some((o) => o.id === payload.new.id)) return prev
              toast.success(
                `Novo pedido de ${(payload.new as Order).customer_name}!`,
              )
              return [payload.new as Order, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? (payload.new as Order) : o,
              ),
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    const previousOrders = [...orders]
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      toast.success('Status atualizado')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar status')
      setOrders(previousOrders)
    }
  }

  async function deleteOrder(id: string) {
    const previousOrders = [...orders]
    setOrders((prev) => prev.filter((o) => o.id !== id))

    try {
      const { error } = await supabase.from('orders').delete().eq('id', id)

      if (error) throw error
      toast.success('Pedido excluído com sucesso')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao excluir pedido')
      setOrders(previousOrders)
    }
  }

  async function createMockOrder() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: estData } = await supabase
        .from('establishments')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!estData) {
        toast.error('Crie um estabelecimento primeiro')
        return
      }

      const mockOrder = {
        establishment_id: estData.id,
        customer_name: 'Cliente Teste ' + Math.floor(Math.random() * 1000),
        customer_whatsapp: '11999999999',
        delivery_address: {
          street: 'Rua das Flores',
          number: Math.floor(Math.random() * 1000).toString(),
          neighborhood: 'Centro',
          city: 'São Paulo',
        },
        payment_method: ['PIX', 'Cartão de Crédito', 'Dinheiro'][
          Math.floor(Math.random() * 3)
        ],
        order_items: [
          { name: 'Hambúrguer Clássico', quantity: 2, price: 25.5 },
          { name: 'Batata Frita', quantity: 1, price: 15.0 },
        ],
        total_price: 'R$ 66,00',
        status: 'ANÁLISE',
      }

      const { error } = await supabase.from('orders').insert(mockOrder)
      if (error) throw error
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao criar pedido teste')
    }
  }

  return { orders, loading, updateStatus, deleteOrder, createMockOrder }
}
