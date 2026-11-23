export class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excluded = [
      'page',
      'sort',
      'limit',
      'fields',
      'keyword',
      'yogaType',
      'location',
      'minPrice',
      'maxPrice',
      'featured',
    ];
    excluded.forEach((key) => delete queryObj[key]);

    // Remove empty strings/values to prevent querying empty criteria
    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key] === '' || queryObj[key] === undefined || queryObj[key] === null) {
        delete queryObj[key];
      }
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search(keywordFields = []) {
    if (this.queryString.keyword && keywordFields.length) {
      const keyword = this.queryString.keyword;
      const orConditions = keywordFields.map((field) => ({
        [field]: { $regex: keyword, $options: 'i' },
      }));
      this.query = this.query.find({ $or: orConditions });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}
