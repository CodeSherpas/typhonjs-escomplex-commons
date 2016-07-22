import ObjectUtil from '../../../utils/ObjectUtil';

/**
 * Provides the base text format transform for ProjectResult matrix list entries.
 */
export default class AbstractTextMatrix
{
   constructor(headers = {}, keys = {})
   {
      this._headers = headers;
      this._keys = keys;
   }

   /**
    * Currently there are no matrix lists stored in modules, but the implementation is complete in case a ModuleReport
    * does have a matrix list.
    *
    * @returns {string}
    */
   formatReport()
   {
      return '';
   }

   /**
    * Formats a matrix list stored in a ProjectResult.
    *
    * @param {ProjectResult}  result - A project result.
    *
    * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
    * @property {string}      matrixKey - An entry key found in the ProjectResult to output.
    *
    * @returns {string}
    */
   formatResult(result, options = {})
   {
      let localOptions = Object.assign({}, this._keys);
      localOptions = Object.assign(localOptions, options);

      const matrixList = ObjectUtil.safeAccess(result, localOptions.matrixList);

      /* istanbul ignore if */
      if (!Array.isArray(matrixList))
      {
         throw new TypeError(`formatResult error: could not locate matrixList '${localOptions.matrixList}'.`);
      }

      /* istanbul ignore if */
      if (!Array.isArray(result.reports))
      {
         throw new TypeError(`formatResult error: could not locate 'result.reports'.`);
      }

      /* istanbul ignore if */
      if (typeof this._headers.entryPrepend !== 'string')
      {
         throw new TypeError(`formatResult error: 'this._headers.entryPrepend' is not a 'string'.`);
      }

      /* istanbul ignore if */
      if (typeof this._headers.entryWrapper !== 'string')
      {
         throw new TypeError(`formatResult error: 'this._headers.entryWrapper' is not a 'string'.`);
      }

      let output = '';

      // Add any defined text header.
      if (typeof this._headers.textHeader === 'string') { output += this._headers.textHeader; }

      output += this._formatMatrixList(result, matrixList, localOptions);

      return output;
   }

   /**
    * Returns a string representing the adjacency relationships by printing out the report index followed by
    * dependent ModuleReport indices / `srcPaths`.
    *
    * @param {ProjectResult}                          result - A project result instance containing the matrix list.
    *
    * @param {Array<{row: number, cols: number[]}>}   matrixList - The matrix list to be serialized.
    *
    * @param {object}                                 options - (Optional) An object hash of options.
    * @propert {boolean}                              zeroIndex - If true module report indexes are zero indexed.
    * @propert {boolean}                              matrixFilePath - If true the module `filePath` is serialized.
    *
    * @returns {string}
    * @private
    */
   _formatMatrixList(result, matrixList, options)
   {
      let output = '';

      const plus1 = typeof options.zeroIndex === 'boolean' && options.zeroIndex ? 0 : 1;
      const path = typeof options.matrixFilePath === 'boolean' && options.matrixFilePath ? 'filePath' : 'srcPath';

      const entryPrepend = this._headers.entryPrepend;
      const entryWrapper = this._headers.entryWrapper;

      matrixList.forEach((entry) =>
      {
         output += `${entryPrepend}${entry.row + plus1}:\t${entryWrapper}${ObjectUtil.safeAccess(
          result.reports[entry.row], path)}${entryWrapper}\n`;

         entry.cols.forEach((colIndex) =>
         {
            output += `\t${entryPrepend}${colIndex + plus1}:\t${entryWrapper}${ObjectUtil.safeAccess(
             result.reports[colIndex], path)}${entryWrapper}\n`;
         });

         output += '\n';
      });

      return output;
   }
}