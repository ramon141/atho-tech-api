import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  SchemaObject,
  HttpErrors,
} from '@loopback/rest';
import { Payments } from '../models';
import { EnterpriseRepository, PaymentsRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { inject } from '@loopback/core';
import apiMercadoPago from '../services/apiMercadoPago';
import moment from 'moment';
// import apiMercadoPago from '../services/apiMercadoPago';

export type PaymentsCreate = {
  email: string;
  first_name: string;
  last_name: string;
  cpf: string;
};

const PaymentSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'first_name', 'last_name', 'cpf'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    first_name: {
      type: 'string',
    },
    last_name: {
      type: 'string',
    },
    cpf: {
      type: 'string',
      minLength: 11,
      maxLength: 11,
    },
  },
};

export class PaymentsController {
  constructor(
    @repository(PaymentsRepository)
    public paymentsRepository: PaymentsRepository,
    @repository(EnterpriseRepository)
    public enterpriseRepository: EnterpriseRepository,
  ) { }

  @post('/payments')
  @response(200, {
    description: 'Payments model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Payments) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, {
            title: 'NewPayments',
            exclude: ['id'],
          }),
        },
      },
    })
    payments: Omit<Payments, 'id'>,
  ): Promise<Payments> {
    return this.paymentsRepository.create(payments);
  }

  @post('/payments/confirm')
  @response(200, {
    description: 'Payments model instance',
    content: { 'application/json': { schema: {} } },
  })
  async confirm(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    data: any,
  ): Promise<void> {
    if (data.action === 'payment.updated') {
      const payment = await this.paymentsRepository.findOne({
        where: {
          id_payment: data.data.id
        }
      });

      if (!payment)
        throw new HttpErrors[401]('O identificador do pagamento não foi encontrado');

      const { data: response } = await apiMercadoPago.get(`v1/payments/${data.data.id}`);

      payment.status = response.status;

      this.paymentsRepository.updateById(payment.id, payment);

      //Adiciona um mês no tempo da empresa
      const enterprise = await this.enterpriseRepository.findById(payment.enterpriseId);
      enterprise.expire_date = moment(enterprise.expire_date).add(30, 'days').toISOString();
      this.enterpriseRepository.updateById(enterprise.id, enterprise);
    }
  }


  // @authenticate('jwt')
  @post('/payments/{id}/generate-intention-payments')
  @response(200, {
    description: 'Create a link to payments by Mercado Pago'
  })
  async generatePasyments(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Generate a link to payments',
      required: true,
      content: {
        'application/json': { schema: PaymentSchema },
      },
    }) data: PaymentsCreate
  ): Promise<{ link: string }> {

    const body = {
      transaction_amount: 0.5,
      description: 'Assinatura',
      payment_method_id: 'pix',
      payer: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        identification: {
          type: 'CPF',
          number: data.cpf
        }
      },
      notification_url: process.env.CALLBACK_CONFIRM
    };

    const { data: response } = await apiMercadoPago.post('v1/payments', body);

    await this.paymentsRepository.create({
      date: response.date_created,
      status: response.status,
      enterpriseId: id,
      id_payment: response.id
    });

    return {
      link: response.point_of_interaction.transaction_data.ticket_url
    }

  }

  @get('/payments/count')
  @response(200, {
    description: 'Payments model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Payments) where?: Where<Payments>,
  ): Promise<Count> {
    return this.paymentsRepository.count(where);
  }

  @get('/payments')
  @response(200, {
    description: 'Array of Payments model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payments, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Payments) filter?: Filter<Payments>,
  ): Promise<Payments[]> {
    return this.paymentsRepository.find(filter);
  }

  @patch('/payments')
  @response(200, {
    description: 'Payments PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, { partial: true }),
        },
      },
    })
    payments: Payments,
    @param.where(Payments) where?: Where<Payments>,
  ): Promise<Count> {
    return this.paymentsRepository.updateAll(payments, where);
  }

  @get('/payments/{id}')
  @response(200, {
    description: 'Payments model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Payments, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Payments, { exclude: 'where' }) filter?: FilterExcludingWhere<Payments>
  ): Promise<Payments> {
    return this.paymentsRepository.findById(id, filter);
  }

  @patch('/payments/{id}')
  @response(204, {
    description: 'Payments PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, { partial: true }),
        },
      },
    })
    payments: Payments,
  ): Promise<void> {
    await this.paymentsRepository.updateById(id, payments);
  }

  @put('/payments/{id}')
  @response(204, {
    description: 'Payments PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() payments: Payments,
  ): Promise<void> {
    await this.paymentsRepository.replaceById(id, payments);
  }

  @del('/payments/{id}')
  @response(204, {
    description: 'Payments DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.paymentsRepository.deleteById(id);
  }
}
