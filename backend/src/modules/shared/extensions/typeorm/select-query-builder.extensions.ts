import { isNotEmpty } from 'class-validator';
import { EntityTarget, SelectQueryBuilder } from 'typeorm';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity>
    extends SelectQueryBuilderExtensionsType {}
}

const qbSearch = (searchBy: string, search: string) => ({
  value: `LOWER(${searchBy}) LIKE LOWER(:search)`,
  params: { search: `%${search}%` },
});

const selectQueryBuilderExtensions = {
  andSearch: function <Entity>(
    this: SelectQueryBuilder<Entity>,
    searchBy?: string,
    search?: string,
  ) {
    if (isNotEmpty(searchBy) && isNotEmpty(search)) {
      const qbSearchParams = qbSearch(searchBy, search);
      this.andWhere(qbSearchParams.value, qbSearchParams.params);
    }
    return this;
  },
  orSearch: function <Entity>(
    this: SelectQueryBuilder<Entity>,
    searchBy?: string,
    search?: string,
  ) {
    if (isNotEmpty(searchBy) && isNotEmpty(search)) {
      const qbSearchParams = qbSearch(searchBy, search);
      this.orWhere(qbSearchParams.value, qbSearchParams.params);
    }
    return this;
  },
  rowsToJson: function <Entity>(
    this: SelectQueryBuilder<Entity>,
    alias: string,
  ) {
    return `
        COALESCE ( 
            ( 
              SELECT array_to_json(array_agg(row_to_json(${alias}))) 
              FROM ( ${this.getQuery()} ) ${alias} 
          ), '[]' 
        )
      `;
  },
  rowToJson: function <Entity>(
    this: SelectQueryBuilder<Entity>,
    alias: string,
  ) {
    return ` 
        (
          SELECT row_to_json(${alias}) 
          FROM ( ${this.getQuery()} ) ${alias}
        )
      `;
  },
  rowsToArray: function <Entity>(
    this: SelectQueryBuilder<Entity>,
    alias: string,
    column: string,
  ) {
    return ` 
      (SELECT COALESCE(array_agg(${alias}.${column}), '{}')
      FROM ( ${this.getQuery()} ) ${alias})
    `;
  },
  subQueryFrom: function <Entity>(
    this: SelectQueryBuilder<Entity>,
    entityTarget: EntityTarget<Entity>,
    alias: string,
  ) {
    return this.subQuery()
      .select(`${alias}.id`, 'id')
      .from(entityTarget, alias);
  },
};

type SelectQueryBuilderExtensionsType = typeof selectQueryBuilderExtensions;

Object.keys(selectQueryBuilderExtensions).forEach((key) =>
  Object.defineProperty(SelectQueryBuilder.prototype, key, {
    value: selectQueryBuilderExtensions[key],
  }),
);
