// type EventHand
type Props = {
	[key: string]: string 
	| boolean 
	| ((e:KeyboardEvent)=>void)
	| ((e:MouseEvent)=>void)
	| ((e:Event)=>void);
};

function createElement(
	tag: string,
	props: Props = {},
	children: (HTMLElement | string)[] = []
): HTMLElement {
	// Create the element with the given tag
	const element = document.createElement(tag);
	
	// Set attributes and add event listeners
	for (const key in props) {
		if (props.hasOwnProperty(key)) {
			const value = props[key];
			if (key.startsWith('on') && typeof value === 'function') {
				// If the key starts with 'on', assume it's an event listener
				const eventName = key.slice(2).toLowerCase();
				element.addEventListener(eventName, value as EventListener);
			}
			else if (typeof value === 'boolean'){
				element.setAttribute(key, "");
			}
			else {
				element.setAttribute(key, value as string);
			}
		}
	}
	
	// Append children
	children.forEach(child => {
		if (typeof child === 'string') {
			// If child is a string, create a text node
			element.appendChild(document.createTextNode(child));
		} else {
			// Otherwise, append the child element directly
			element.appendChild(child);
		}
	});
	
	return element;
}

export default createElement;
export type {Props};