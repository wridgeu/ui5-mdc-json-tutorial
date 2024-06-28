import DefaultTypeMap from "sap/ui/mdc/DefaultTypeMap";
import BaseType from "sap/ui/mdc/enums/BaseType";
/**
 * We have to require the type here, as there is no library where we could declare them and ensure,
 * that they will be loaded in our application. A small change to improve this is currently under consideration.
 * - https://github.com/SAP-samples/ui5-mdc-json-tutorial/blob/main/ex4/readme.md#modeltypetypemapts
 */
import LengthMeter from "mdc/tutorial/model/type/LengthMeter";

const TypeMap = Object.assign({}, DefaultTypeMap);
TypeMap.import(DefaultTypeMap);
TypeMap.set("mdc.tutorial.model.type.LengthMeter", BaseType.Numeric);
TypeMap.freeze();

export default TypeMap;
