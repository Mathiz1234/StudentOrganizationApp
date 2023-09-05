import { ClassConstructor, plainToInstance } from 'class-transformer';

export class ClassAdapterHelper {
  public static adaptToOneClass<T, V>(cls: ClassConstructor<T>, plain: V) {
    return plainToInstance(cls, plain, { excludeExtraneousValues: true });
  }

  public static adaptToManyClass<T, V>(cls: ClassConstructor<T>, plain: V[]) {
    return plainToInstance(cls, plain, { excludeExtraneousValues: true });
  }
}
