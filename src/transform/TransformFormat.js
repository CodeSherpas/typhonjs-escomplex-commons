import ModuleReport              from '../module/report/ModuleReport';
import ProjectResult             from '../project/result/ProjectResult';

import FormatJSON                from './formats/json/FormatJSON';
import FormatJSONCheckstyle      from './formats/json/FormatJSONCheckstyle';
import FormatJSONMinimal         from './formats/json/FormatJSONMinimal';
import FormatJSONModules         from './formats/json/FormatJSONModules';
import FormatMarkdown            from './formats/markdown/FormatMarkdown';
import FormatMarkdownAdjacency   from './formats/markdown/FormatMarkdownAdjacency';
import FormatMarkdownMinimal     from './formats/markdown/FormatMarkdownMinimal';
import FormatMarkdownModules     from './formats/markdown/FormatMarkdownModules';
import FormatMarkdownVisibility  from './formats/markdown/FormatMarkdownVisibility';
import FormatText                from './formats/text/FormatText';
import FormatTextAdjacency       from './formats/text/FormatTextAdjacency';
import FormatTextMinimal         from './formats/text/FormatTextMinimal';
import FormatTextModules         from './formats/text/FormatTextModules';
import FormatTextVisibility      from './formats/text/FormatTextVisibility';

/**
 * Stores all transform formats.
 * @type {Map<string>, object}
 * @ignore
 */
const s_FORMATTERS = new Map();

export default class TransformFormat
{
   /**
    * Adds a formatter to the static Map by type: `format.type`.
    *
    * @param {object}   format - An instance of an object conforming to the module / project transform format API.
    */
   static addFormat(format)
   {
      if (typeof format !== 'object') { throw new TypeError(`addFormat error: 'format' is not an 'object'.`); }

      if (typeof format.extension !== 'string')
      {
         throw new TypeError(`addFormat error: 'format.extension' is not a 'string'.`);
      }

      if (typeof format.name !== 'string')
      {
         throw new TypeError(`addFormat error: 'format.name' is not a 'string'.`);
      }

      if (typeof format.type !== 'string')
      {
         throw new TypeError(`addFormat error: 'format.type' is not a 'string'.`);
      }

      if (typeof format.formatReport !== 'function')
      {
         throw new TypeError(`addFormat error: 'format.formatReport' is not a 'function'.`);
      }

      if (typeof format.formatResult !== 'function')
      {
         throw new TypeError(`addFormat error: 'format.formatResult' is not a 'function'.`);
      }

      s_FORMATTERS.set(format.name, format);
   }

   /**
    * Invokes the callback for each stored formatter.
    *
    * @param {function} callback - A callback function.
    * @param {object}   thisArg - (Optional) this context.
    */
   static forEach(callback, thisArg)
   {
      s_FORMATTERS.forEach(callback, thisArg);
   }

   /**
    * Provides a `forEach` variation that invokes the callback if the given extension matches that of a stored
    * formatter.
    *
    * @param {string}   extension - A format extension.
    * @param {function} callback - A callback function.
    * @param {object}   thisArg - (Optional) this context.
    */
   static forEachExt(extension, callback, thisArg = undefined)
   {
      for (const format of s_FORMATTERS.values())
      {
         if (format.extension === extension) { callback.call(thisArg, format, format.name); }
      }
   }

   /**
    * Provides a `forEach` variation that invokes the callback if the given type matches that of a stored
    * formatter.
    *
    * @param {string}   type - A format type.
    * @param {function} callback - A callback function.
    * @param {object}   thisArg - (Optional) this context.
    */
   static forEachType(type, callback, thisArg = undefined)
   {
      for (const format of s_FORMATTERS.values())
      {
         if (format.type === type) { callback.call(thisArg, format, format.name); }
      }
   }

   /**
    * Formats a given ModuleReport or ProjectResult via the formatter of the requested type.
    *
    * @param {ModuleReport|ProjectResult} resultOrReport - A ModuleReport or ProjectResult to format.
    *
    * @param {string}                     name - The name of formatter to invoke.
    *
    * @param {object}                     options - (Optional) One or more optional parameters to pass to the formatter.
    *
    * @returns {string}
    */
   static format(resultOrReport, name, options = undefined)
   {
      if (!(resultOrReport instanceof ModuleReport || resultOrReport instanceof ProjectResult))
      {
         throw new TypeError(`format error: 'resultOrReport' is not a 'ModuleReport' or a 'ProjectResult'.`);
      }

      const formatter = s_FORMATTERS.get(name);

      if (typeof formatter === 'undefined')
      {
         throw new Error(`format error: unknown formatter name '${name}'.`);
      }

      if (resultOrReport instanceof ModuleReport)
      {
         return formatter.formatReport(resultOrReport, options);
      }

      if (resultOrReport instanceof ProjectResult)
      {
         return formatter.formatResult(resultOrReport, options);
      }
   }

   /**
    * Returns the supported format file extension types.
    *
    * @returns {string[]}
    */
   static getFileExtensions()
   {
      return Array.from(s_FORMATTERS.values()).map((format) => { return format.extension; });
   }

   /**
    * Returns the format names supported.
    *
    * @returns {string[]}
    */
   static getNames()
   {
      return Array.from(s_FORMATTERS.keys());
   }

   /**
    * Returns the format types supported.
    *
    * @returns {string[]}
    */
   static getTypes()
   {
      return Array.from(s_FORMATTERS.values()).map((format) => { return format.type; });
   }

   /**
    * Returns whether a given formatter by name is available.
    *
    * @param {string}   name - The name of the formatter: `format.name`.
    *
    * @returns {boolean}
    */
   static isFormat(name)
   {
      return s_FORMATTERS.has(name);
   }

   /**
    * Removes a formatter from the static Map by name.
    *
    * @param {string}   name - The name of the formatter: `format.name`.
    */
   static removeFormat(name)
   {
      s_FORMATTERS.delete(name);
   }
}

/**
 * Load all integrated format transforms.
 */
TransformFormat.addFormat(new FormatJSON());
TransformFormat.addFormat(new FormatJSONCheckstyle());
TransformFormat.addFormat(new FormatJSONMinimal());
TransformFormat.addFormat(new FormatJSONModules());
TransformFormat.addFormat(new FormatMarkdown());
TransformFormat.addFormat(new FormatMarkdownAdjacency());
TransformFormat.addFormat(new FormatMarkdownMinimal());
TransformFormat.addFormat(new FormatMarkdownModules());
TransformFormat.addFormat(new FormatMarkdownVisibility());
TransformFormat.addFormat(new FormatText());
TransformFormat.addFormat(new FormatTextAdjacency());
TransformFormat.addFormat(new FormatTextMinimal());
TransformFormat.addFormat(new FormatTextModules());
TransformFormat.addFormat(new FormatTextVisibility());
