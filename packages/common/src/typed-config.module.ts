import {
  DynamicModule,
  Global,
  Injectable,
  Module,
  Type,
} from '@nestjs/common';
import { validateEnvironment } from './environment-validation';

@Injectable()
export class TypedConfigService<T extends object> {
  constructor(private readonly config: T) {}

  get<K extends keyof T>(key: K): T[K] {
    return this.config[key];
  }
}

@Global()
@Module({})
export class TypedConfigModule {
  static forRoot<T extends object>(
    ConfigVariablesClass: Type<T>,
  ): DynamicModule {
    return {
      module: TypedConfigModule,
      providers: [
        {
          provide: TypedConfigService,
          useFactory: () => {
            const validated = validateEnvironment(
              ConfigVariablesClass,
              process.env as Record<string, unknown>,
            );
            return new TypedConfigService(validated);
          },
        },
      ],
      exports: [TypedConfigService],
    };
  }
}
