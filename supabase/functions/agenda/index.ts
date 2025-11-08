import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const method = req.method;

    console.log('Request:', { method, path: url.pathname, pathParts });

    // EMPRESAS
    if (pathParts[0] === 'companies') {
      if (pathParts.length === 1) {
        // GET /companies
        if (method === 'GET') {
          const { data, error } = await supabaseClient
            .from('empresas')
            .select('*')
            .order('nome_fantasia');

          if (error) throw error;
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // POST /companies
        if (method === 'POST') {
          const body = await req.json();
          const { data, error } = await supabaseClient
            .from('empresas')
            .insert(body)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (pathParts.length === 2) {
        const companyId = pathParts[1];

        // GET /companies/:id
        if (method === 'GET') {
          const { data, error } = await supabaseClient
            .from('empresas')
            .select('*')
            .eq('id', companyId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // PUT /companies/:id
        if (method === 'PUT') {
          const body = await req.json();
          const { data, error } = await supabaseClient
            .from('empresas')
            .update(body)
            .eq('id', companyId)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // PROFISSIONAIS
      if (pathParts.length >= 3 && pathParts[2] === 'professionals') {
        const companyId = pathParts[1];

        if (pathParts.length === 3) {
          // GET /companies/:id/professionals
          if (method === 'GET') {
            const { data, error } = await supabaseClient
              .from('profissionais')
              .select('*')
              .eq('empresa_id', companyId)
              .order('nome');

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // POST /companies/:id/professionals
          if (method === 'POST') {
            const body = await req.json();
            const { data, error } = await supabaseClient
              .from('profissionais')
              .insert({ ...body, empresa_id: companyId })
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              status: 201,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }

        if (pathParts.length === 4) {
          const profId = pathParts[3];

          // GET /companies/:id/professionals/:prof_id
          if (method === 'GET') {
            const { data, error } = await supabaseClient
              .from('profissionais')
              .select('*')
              .eq('id', profId)
              .eq('empresa_id', companyId)
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // PUT /companies/:id/professionals/:prof_id
          if (method === 'PUT') {
            const body = await req.json();
            const { data, error } = await supabaseClient
              .from('profissionais')
              .update(body)
              .eq('id', profId)
              .eq('empresa_id', companyId)
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }
      }

      // SERVIÇOS
      if (pathParts.length >= 3 && pathParts[2] === 'services') {
        const companyId = pathParts[1];

        if (pathParts.length === 3) {
          // GET /companies/:id/services
          if (method === 'GET') {
            const { data, error } = await supabaseClient
              .from('servicos')
              .select('*')
              .eq('empresa_id', companyId)
              .order('nome');

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // POST /companies/:id/services
          if (method === 'POST') {
            const body = await req.json();
            const { data, error } = await supabaseClient
              .from('servicos')
              .insert({ ...body, empresa_id: companyId })
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              status: 201,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }

        if (pathParts.length === 4) {
          const serviceId = pathParts[3];

          // GET /companies/:id/services/:service_id
          if (method === 'GET') {
            const { data, error } = await supabaseClient
              .from('servicos')
              .select('*')
              .eq('id', serviceId)
              .eq('empresa_id', companyId)
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // PUT /companies/:id/services/:service_id
          if (method === 'PUT') {
            const body = await req.json();
            const { data, error } = await supabaseClient
              .from('servicos')
              .update(body)
              .eq('id', serviceId)
              .eq('empresa_id', companyId)
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }
      }

      // CLIENTES
      if (pathParts.length >= 3 && pathParts[2] === 'clients') {
        const companyId = pathParts[1];

        if (pathParts.length === 3) {
          // GET /companies/:id/clients
          if (method === 'GET') {
            const { data, error } = await supabaseClient
              .from('clientes')
              .select('*')
              .eq('empresa_id', companyId)
              .order('nome');

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // POST /companies/:id/clients
          if (method === 'POST') {
            const body = await req.json();
            const { data, error } = await supabaseClient
              .from('clientes')
              .insert({ ...body, empresa_id: companyId })
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              status: 201,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }

        if (pathParts.length === 4) {
          const clientId = pathParts[3];

          // GET /companies/:id/clients/:client_id
          if (method === 'GET') {
            const { data, error } = await supabaseClient
              .from('clientes')
              .select('*')
              .eq('id', clientId)
              .eq('empresa_id', companyId)
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // PUT /companies/:id/clients/:client_id
          if (method === 'PUT') {
            const body = await req.json();
            const { data, error } = await supabaseClient
              .from('clientes')
              .update(body)
              .eq('id', clientId)
              .eq('empresa_id', companyId)
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }
      }

      // AGENDAMENTOS
      if (pathParts.length >= 3 && pathParts[2] === 'appointments') {
        const companyId = pathParts[1];

        if (pathParts.length === 3) {
          // GET /companies/:id/appointments
          if (method === 'GET') {
            let query = supabaseClient
              .from('agendamentos')
              .select(`
                *,
                cliente:clientes(nome, telefone, email),
                profissional:profissionais(nome, funcao),
                servico:servicos(nome, duracao_minutos, preco)
              `)
              .eq('empresa_id', companyId);

            // Filtros
            const profissionalId = url.searchParams.get('profissional_id');
            const status = url.searchParams.get('status');
            const dataInicial = url.searchParams.get('data_inicial');
            const dataFinal = url.searchParams.get('data_final');

            if (profissionalId) query = query.eq('profissional_id', profissionalId);
            if (status) query = query.eq('status', status);
            if (dataInicial) query = query.gte('data', dataInicial);
            if (dataFinal) query = query.lte('data', dataFinal);

            query = query.order('data').order('hora_inicio');

            const { data, error } = await query;

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // POST /companies/:id/appointments
          if (method === 'POST') {
            const body = await req.json();

            // Validações de segurança
            const { data: profissional } = await supabaseClient
              .from('profissionais')
              .select('empresa_id')
              .eq('id', body.profissional_id)
              .single();

            if (!profissional || profissional.empresa_id !== companyId) {
              return new Response(JSON.stringify({ error: 'Profissional não pertence a esta empresa' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
            }

            const { data: servico, error: servicoError } = await supabaseClient
              .from('servicos')
              .select('duracao_minutos, empresa_id')
              .eq('id', body.servico_id)
              .single();

            if (servicoError) throw servicoError;

            if (servico.empresa_id !== companyId) {
              return new Response(JSON.stringify({ error: 'Serviço não pertence a esta empresa' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
            }

            const { data: cliente } = await supabaseClient
              .from('clientes')
              .select('empresa_id')
              .eq('id', body.cliente_id)
              .single();

            if (!cliente || cliente.empresa_id !== companyId) {
              return new Response(JSON.stringify({ error: 'Cliente não pertence a esta empresa' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
            }

            // Calcular hora_fim
            const horaInicio = new Date(body.hora_inicio);
            const horaFim = new Date(horaInicio.getTime() + servico.duracao_minutos * 60000);

            const agendamento = {
              ...body,
              empresa_id: companyId,
              hora_fim: horaFim.toISOString(),
              data: new Date(body.hora_inicio).toISOString().split('T')[0]
            };

            const { data, error } = await supabaseClient
              .from('agendamentos')
              .insert(agendamento)
              .select(`
                *,
                cliente:clientes(nome, telefone, email),
                profissional:profissionais(nome, funcao),
                servico:servicos(nome, duracao_minutos, preco)
              `)
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              status: 201,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }

        if (pathParts.length === 4) {
          const appointmentId = pathParts[3];

          // PUT /companies/:id/appointments/:appointment_id
          if (method === 'PUT') {
            const body = await req.json();

            // Validações de segurança
            if (body.profissional_id) {
              const { data: profissional } = await supabaseClient
                .from('profissionais')
                .select('empresa_id')
                .eq('id', body.profissional_id)
                .single();

              if (!profissional || profissional.empresa_id !== companyId) {
                return new Response(JSON.stringify({ error: 'Profissional não pertence a esta empresa' }), {
                  status: 400,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }

            if (body.servico_id) {
              const { data: servico } = await supabaseClient
                .from('servicos')
                .select('empresa_id')
                .eq('id', body.servico_id)
                .single();

              if (!servico || servico.empresa_id !== companyId) {
                return new Response(JSON.stringify({ error: 'Serviço não pertence a esta empresa' }), {
                  status: 400,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }

            // Se mudou a hora ou o serviço, recalcular hora_fim
            let updateData = { ...body };

            if (body.hora_inicio || body.servico_id) {
              const { data: currentData } = await supabaseClient
                .from('agendamentos')
                .select('hora_inicio, servico_id')
                .eq('id', appointmentId)
                .single();

              const servicoId = body.servico_id || currentData?.servico_id;
              const horaInicio = body.hora_inicio || currentData?.hora_inicio;

              const { data: servico } = await supabaseClient
                .from('servicos')
                .select('duracao_minutos')
                .eq('id', servicoId)
                .single();

              if (servico) {
                const inicio = new Date(horaInicio);
                const fim = new Date(inicio.getTime() + servico.duracao_minutos * 60000);
                updateData.hora_fim = fim.toISOString();
                updateData.data = inicio.toISOString().split('T')[0];
              }
            }

            const { data, error } = await supabaseClient
              .from('agendamentos')
              .update(updateData)
              .eq('id', appointmentId)
              .eq('empresa_id', companyId)
              .select(`
                *,
                cliente:clientes(nome, telefone, email),
                profissional:profissionais(nome, funcao),
                servico:servicos(nome, duracao_minutos, preco)
              `)
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // DELETE /companies/:id/appointments/:appointment_id
          if (method === 'DELETE') {
            const { data, error } = await supabaseClient
              .from('agendamentos')
              .update({ status: 'cancelado' })
              .eq('id', appointmentId)
              .eq('empresa_id', companyId)
              .select()
              .single();

            if (error) throw error;
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }
      }

      // DISPONIBILIDADE
      if (pathParts.length === 4 && pathParts[2] === 'availability') {
        const companyId = pathParts[1];
        const profissionalId = url.searchParams.get('profissional_id');
        const date = url.searchParams.get('date');

        if (!profissionalId || !date) {
          throw new Error('profissional_id e date são obrigatórios');
        }

        // Buscar agendamentos do dia
        const { data: agendamentos, error } = await supabaseClient
          .from('agendamentos')
          .select('hora_inicio, hora_fim')
          .eq('profissional_id', profissionalId)
          .eq('data', date)
          .not('status', 'in', '(cancelado,concluido)');

        if (error) throw error;

        // Retornar horários ocupados
        return new Response(JSON.stringify({
          profissional_id: profissionalId,
          date,
          occupied_slots: agendamentos
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Endpoint não encontrado' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
