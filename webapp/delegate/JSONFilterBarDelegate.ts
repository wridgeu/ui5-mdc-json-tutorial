import FilterBarDelegate from "sap/ui/mdc/FilterBarDelegate";
import JSONPropertyInfo from "mdc/tutorial/model/metadata/JSONPropertyInfo";
import FilterField from "sap/ui/mdc/FilterField";
import Element from "sap/ui/core/Element";
import type {
	default as FilterBar,
	PropertyInfo as FilterBarPropertyInfo,
} from "sap/ui/mdc/FilterBar";
import type ValueHelp from "sap/ui/mdc/ValueHelp";
import Fragment from "sap/ui/core/Fragment";
import JSONBaseDelegate from "./JSONBaseDelegate";

interface FilterBarPayload {
	valueHelp: {
		[key: string]: string;
	};
}

const _createValueHelp = async (filterBar: FilterBar, propertyKey: string) => {
	const path = "mdc.tutorial.view.fragment.";
	const valueHelp = (await Fragment.load({
		name:
			path +
			(filterBar.getPayload() as FilterBarPayload).valueHelp[propertyKey],
	})) as unknown as ValueHelp;
	filterBar.addDependent(valueHelp);
	return valueHelp;
};

/**
 * Dynamically adds a filter field and dynamically adds a ValueHelp based on a pre-define fragment.
 * Fragments are added as dependents for the lifecycle. Dependents are also used for caching.
 *
 * Which ValueHelp is used for which 'name'/key of the metadata depends on the given payload.
 */
const _createFilterField = async (
	id: string,
	property: FilterBarPropertyInfo,
	filterBar: FilterBar,
) => {
	const propertyKey = property.key;
	const filterField = new FilterField(id, {
		dataType: property.dataType,
		conditions: `{$filters>/conditions/${propertyKey}}`,
		propertyKey: propertyKey,
		required: property.required,
		label: property.label,
		maxConditions: property.maxConditions,
		delegate: { name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {} },
	});
	if ((filterBar.getPayload() as FilterBarPayload).valueHelp[propertyKey]) {
		const dependents = filterBar.getDependents();
		let valueHelp = dependents.find((dependent) =>
			dependent.getId().includes(propertyKey),
		) as ValueHelp;
		valueHelp ??= await _createValueHelp(filterBar, propertyKey);
		filterField.setValueHelp(valueHelp);
	}
	return filterField;
};

/**
 * It's a non-extensible/instantiatible object, thus simply copying it and adding/overwriting
 * methods where necessary.
 */
const JSONFilterBarDelegate = Object.assign({}, FilterBarDelegate, JSONBaseDelegate);

/**
 * Basically the base of everything. Defines the entire metadata, the controls act on.
 * For FilterBar or the Table it's the FieldNames or Columns which can be used for search
 * or display respectively, when clicking on the configuration cogwheel.
 */
JSONFilterBarDelegate.fetchProperties = async () => JSONPropertyInfo;

/**
 * Basically defines how the newly marked key (when selecting an option of the cogwheel)
 * is created and added to the control, includes caching (dedup).
 */
JSONFilterBarDelegate.addItem = async (
	filterBar: FilterBar,
	propertyKey: string,
) => {
	const property = JSONPropertyInfo.find(
		(p) => p.key === propertyKey,
	) as FilterBarPropertyInfo;
	const id = `${filterBar.getId()}--filter--${propertyKey}`;
	const filterField = Element.getElementById(id) as FilterField;
	return filterField ?? _createFilterField(id, property, filterBar);
};

export default JSONFilterBarDelegate;
