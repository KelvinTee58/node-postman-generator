# 2.7.0

1. Improve the params code,
2. Improve the query code,
3. Synchronously modify the postman2.1 builder file code,
4. Migrate the document to the /doc file

# 2.8.0

1. `apiParamGroup`,`apiQueryGroup`,` apiBody` support multi-line mode.
2. This method is no longer supported.

```
@apiParamGroup [[{type} name Description]]
@apiQueryGroup [[{type} name Description]]
@apiBody [[{type} name Description]]

```

3. Currently using a more standardized json format `apiParamGroup`,`apiQueryGroup`,` apiBody`,Example:

```javascript
/**
 * @apiParamGroup [
 *   {"type": "String", "name": "username", "description": "Username"},
 *   {"type": "Number", "name": "age", "description": "User age", "optional": true}
 * ]
 */
```
