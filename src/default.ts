/**
 * Created by axetroy on 16-9-16.
 */

interface Entity {
  limit: number,
  page: number,
  skip: number,
  sort: string[],
  query: any
}

/**
 * @const
 * @type {{}}
 */
const DEFAULT_QUERY = {};

/**
 * @type {string}
 * @constant
 */
const DEFAULT_SORT = '';

/**
 * @const
 * @type {number}
 */
const DEFAULT_LIMIT = 10;

/**
 * @const
 * @type {number}
 */
const DEFAULT_PAGE = 0;

/**
 * @const
 * @type {number}
 */
const DEFAULT_SKIP = 0;

const DEFAULT_ENTITY: Entity = {
  query: DEFAULT_QUERY,
  sort: [],
  limit: DEFAULT_LIMIT,
  page: DEFAULT_PAGE,
  skip: DEFAULT_SKIP
};

export {
  DEFAULT_QUERY,
  DEFAULT_SORT,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SKIP,
  DEFAULT_ENTITY,
  Entity
}