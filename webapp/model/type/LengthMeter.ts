import Integer from "sap/ui/model/type/Integer";
import NumberFormat from "sap/ui/core/format/NumberFormat";

/**
 * This is only an exemplary type, which makes not much sense and if we look very carefully
 * we might find some issues with it. For a complete implementation of a custom type,
 * see the corresponding article in the UI5 Documentation: https://sdk.openui5.org/topic/07e4b920f5734fd78fdaa236f26236d8
 *
 * @namespace mdc.tutorial.model.type
 */
export default class LengthMeter extends Integer {
	formatValue(height: number) {
		const unitFormat = NumberFormat.getUnitInstance();
		return unitFormat.format(height, "length-meter");
	}
}
