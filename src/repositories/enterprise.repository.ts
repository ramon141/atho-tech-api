import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Enterprise, EnterpriseRelations, Products, User, Services, Kits, Payments, Configuration, Dependency} from '../models';
import {ProductsRepository} from './products.repository';
import {UserRepository} from './user.repository';
import {ServicesRepository} from './services.repository';
import {KitsRepository} from './kits.repository';
import {PaymentsRepository} from './payments.repository';
import {ConfigurationRepository} from './configuration.repository';
import {DependencyRepository} from './dependency.repository';

export class EnterpriseRepository extends DefaultCrudRepository<
  Enterprise,
  typeof Enterprise.prototype.id,
  EnterpriseRelations
> {

  public readonly products: HasManyRepositoryFactory<Products, typeof Enterprise.prototype.id>;

  public readonly users: HasManyRepositoryFactory<User, typeof Enterprise.prototype.id>;

  public readonly services: HasManyRepositoryFactory<Services, typeof Enterprise.prototype.id>;

  public readonly kits: HasManyRepositoryFactory<Kits, typeof Enterprise.prototype.id>;

  public readonly payments: HasManyRepositoryFactory<Payments, typeof Enterprise.prototype.id>;

  public readonly configurations: HasManyRepositoryFactory<Configuration, typeof Enterprise.prototype.id>;

  public readonly dependencies: HasManyRepositoryFactory<Dependency, typeof Enterprise.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProductsRepository') protected productsRepositoryGetter: Getter<ProductsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ServicesRepository') protected servicesRepositoryGetter: Getter<ServicesRepository>, @repository.getter('KitsRepository') protected kitsRepositoryGetter: Getter<KitsRepository>, @repository.getter('PaymentsRepository') protected paymentsRepositoryGetter: Getter<PaymentsRepository>, @repository.getter('ConfigurationRepository') protected configurationRepositoryGetter: Getter<ConfigurationRepository>, @repository.getter('DependencyRepository') protected dependencyRepositoryGetter: Getter<DependencyRepository>,
  ) {
    super(Enterprise, dataSource);
    this.dependencies = this.createHasManyRepositoryFactoryFor('dependencies', dependencyRepositoryGetter,);
    this.registerInclusionResolver('dependencies', this.dependencies.inclusionResolver);
    this.configurations = this.createHasManyRepositoryFactoryFor('configurations', configurationRepositoryGetter,);
    this.registerInclusionResolver('configurations', this.configurations.inclusionResolver);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentsRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
    this.kits = this.createHasManyRepositoryFactoryFor('kits', kitsRepositoryGetter,);
    this.registerInclusionResolver('kits', this.kits.inclusionResolver);
    this.services = this.createHasManyRepositoryFactoryFor('services', servicesRepositoryGetter,);
    this.registerInclusionResolver('services', this.services.inclusionResolver);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.products = this.createHasManyRepositoryFactoryFor('products', productsRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
