/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT, ɵgetDOM as getDOM } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManagerPlugin } from './event_manager';
/**
 * Defines supported modifiers for key events.
 */
import * as ɵngcc0 from '@angular/core';
const MODIFIER_KEYS = ['alt', 'control', 'meta', 'shift'];
const DOM_KEY_LOCATION_NUMPAD = 3;
// Map to convert some key or keyIdentifier values to what will be returned by getEventKey
const _keyMap = {
    // The following values are here for cross-browser compatibility and to match the W3C standard
    // cf http://www.w3.org/TR/DOM-Level-3-Events-key/
    '\b': 'Backspace',
    '\t': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    'Del': 'Delete',
    'Esc': 'Escape',
    'Left': 'ArrowLeft',
    'Right': 'ArrowRight',
    'Up': 'ArrowUp',
    'Down': 'ArrowDown',
    'Menu': 'ContextMenu',
    'Scroll': 'ScrollLock',
    'Win': 'OS'
};
// There is a bug in Chrome for numeric keypad keys:
// https://code.google.com/p/chromium/issues/detail?id=155654
// 1, 2, 3 ... are reported as A, B, C ...
const _chromeNumKeyPadMap = {
    'A': '1',
    'B': '2',
    'C': '3',
    'D': '4',
    'E': '5',
    'F': '6',
    'G': '7',
    'H': '8',
    'I': '9',
    'J': '*',
    'K': '+',
    'M': '-',
    'N': '.',
    'O': '/',
    '\x60': '0',
    '\x90': 'NumLock'
};
const ɵ0 = (event) => event.altKey, ɵ1 = (event) => event.ctrlKey, ɵ2 = (event) => event.metaKey, ɵ3 = (event) => event.shiftKey;
/**
 * Retrieves modifiers from key-event objects.
 */
const MODIFIER_KEY_GETTERS = {
    'alt': ɵ0,
    'control': ɵ1,
    'meta': ɵ2,
    'shift': ɵ3
};
/**
 * @publicApi
 * A browser plug-in that provides support for handling of key events in Angular.
 */
export class KeyEventsPlugin extends EventManagerPlugin {
    /**
     * Initializes an instance of the browser plug-in.
     * @param doc The document in which key events will be detected.
     */
    constructor(doc) {
        super(doc);
    }
    /**
     * Reports whether a named key event is supported.
     * @param eventName The event name to query.
     * @return True if the named key event is supported.
     */
    supports(eventName) {
        return KeyEventsPlugin.parseEventName(eventName) != null;
    }
    /**
     * Registers a handler for a specific element and key event.
     * @param element The HTML element to receive event notifications.
     * @param eventName The name of the key event to listen for.
     * @param handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @returns The key event that was registered.
     */
    addEventListener(element, eventName, handler) {
        const parsedEvent = KeyEventsPlugin.parseEventName(eventName);
        const outsideHandler = KeyEventsPlugin.eventCallback(parsedEvent['fullKey'], handler, this.manager.getZone());
        return this.manager.getZone().runOutsideAngular(() => {
            return getDOM().onAndCancel(element, parsedEvent['domEventName'], outsideHandler);
        });
    }
    static parseEventName(eventName) {
        const parts = eventName.toLowerCase().split('.');
        const domEventName = parts.shift();
        if ((parts.length === 0) || !(domEventName === 'keydown' || domEventName === 'keyup')) {
            return null;
        }
        const key = KeyEventsPlugin._normalizeKey(parts.pop());
        let fullKey = '';
        MODIFIER_KEYS.forEach(modifierName => {
            const index = parts.indexOf(modifierName);
            if (index > -1) {
                parts.splice(index, 1);
                fullKey += modifierName + '.';
            }
        });
        fullKey += key;
        if (parts.length != 0 || key.length === 0) {
            // returning null instead of throwing to let another plugin process the event
            return null;
        }
        const result = {};
        result['domEventName'] = domEventName;
        result['fullKey'] = fullKey;
        return result;
    }
    static getEventFullKey(event) {
        let fullKey = '';
        let key = getEventKey(event);
        key = key.toLowerCase();
        if (key === ' ') {
            key = 'space'; // for readability
        }
        else if (key === '.') {
            key = 'dot'; // because '.' is used as a separator in event names
        }
        MODIFIER_KEYS.forEach(modifierName => {
            if (modifierName != key) {
                const modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
                if (modifierGetter(event)) {
                    fullKey += modifierName + '.';
                }
            }
        });
        fullKey += key;
        return fullKey;
    }
    /**
     * Configures a handler callback for a key event.
     * @param fullKey The event name that combines all simultaneous keystrokes.
     * @param handler The function that responds to the key event.
     * @param zone The zone in which the event occurred.
     * @returns A callback function.
     */
    static eventCallback(fullKey, handler, zone) {
        return (event /** TODO #9100 */) => {
            if (KeyEventsPlugin.getEventFullKey(event) === fullKey) {
                zone.runGuarded(() => handler(event));
            }
        };
    }
    /** @internal */
    static _normalizeKey(keyName) {
        // TODO: switch to a Map if the mapping grows too much
        switch (keyName) {
            case 'esc':
                return 'escape';
            default:
                return keyName;
        }
    }
}
KeyEventsPlugin.ɵfac = function KeyEventsPlugin_Factory(t) { return new (t || KeyEventsPlugin)(ɵngcc0.ɵɵinject(DOCUMENT)); };
KeyEventsPlugin.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: KeyEventsPlugin, factory: KeyEventsPlugin.ɵfac });
KeyEventsPlugin.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(KeyEventsPlugin, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }]; }, null); })();
function getEventKey(event) {
    let key = event.key;
    if (key == null) {
        key = event.keyIdentifier;
        // keyIdentifier is defined in the old draft of DOM Level 3 Events implemented by Chrome and
        // Safari cf
        // http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html#Events-KeyboardEvents-Interfaces
        if (key == null) {
            return 'Unidentified';
        }
        if (key.startsWith('U+')) {
            key = String.fromCharCode(parseInt(key.substring(2), 16));
            if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
                // There is a bug in Chrome for numeric keypad keys:
                // https://code.google.com/p/chromium/issues/detail?id=155654
                // 1, 2, 3 ... are reported as A, B, C ...
                key = _chromeNumKeyPadMap[key];
            }
        }
    }
    return _keyMap[key] || key;
}
export { ɵ0, ɵ1, ɵ2, ɵ3 };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5X2V2ZW50cy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvZG9tL2V2ZW50cy9rZXlfZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFFLE9BQU8sSUFBSSxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVuRDtBQUNBO0FBQ0EsR0FBRzs7QUFDSCxNQUFNLGFBQWEsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTFELE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO0FBRWxDLDBGQUEwRjtBQUMxRixNQUFNLE9BQU8sR0FBMEI7QUFDdkMsSUFBRSw4RkFBOEY7QUFDaEcsSUFBRSxrREFBa0Q7QUFDcEQsSUFBRSxJQUFJLEVBQUUsV0FBVztBQUNuQixJQUFFLElBQUksRUFBRSxLQUFLO0FBQ2IsSUFBRSxNQUFNLEVBQUUsUUFBUTtBQUNsQixJQUFFLE1BQU0sRUFBRSxRQUFRO0FBQ2xCLElBQUUsS0FBSyxFQUFFLFFBQVE7QUFDakIsSUFBRSxLQUFLLEVBQUUsUUFBUTtBQUNqQixJQUFFLE1BQU0sRUFBRSxXQUFXO0FBQ3JCLElBQUUsT0FBTyxFQUFFLFlBQVk7QUFDdkIsSUFBRSxJQUFJLEVBQUUsU0FBUztBQUNqQixJQUFFLE1BQU0sRUFBRSxXQUFXO0FBQ3JCLElBQUUsTUFBTSxFQUFFLGFBQWE7QUFDdkIsSUFBRSxRQUFRLEVBQUUsWUFBWTtBQUN4QixJQUFFLEtBQUssRUFBRSxJQUFJO0FBQ2IsQ0FBQyxDQUFDO0FB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QUFRLDBDQUEwQztBQUNsRCxnQkFBUSxHQUFHLEdBQUksbUJBQTJCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEQsYUFBTztBQUNQLFNBQUs7QUFDTCxLQUFHO0FBQ0gsSUFDRSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUM7QUFDN0IsQ0FBQztBQUNEO0FBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlQsIMm1Z2V0RE9NIGFzIGdldERPTX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtFdmVudE1hbmFnZXJQbHVnaW59IGZyb20gJy4vZXZlbnRfbWFuYWdlcic7XG5cbi8qKlxuICogRGVmaW5lcyBzdXBwb3J0ZWQgbW9kaWZpZXJzIGZvciBrZXkgZXZlbnRzLlxuICovXG5jb25zdCBNT0RJRklFUl9LRVlTID0gWydhbHQnLCAnY29udHJvbCcsICdtZXRhJywgJ3NoaWZ0J107XG5cbmNvbnN0IERPTV9LRVlfTE9DQVRJT05fTlVNUEFEID0gMztcblxuLy8gTWFwIHRvIGNvbnZlcnQgc29tZSBrZXkgb3Iga2V5SWRlbnRpZmllciB2YWx1ZXMgdG8gd2hhdCB3aWxsIGJlIHJldHVybmVkIGJ5IGdldEV2ZW50S2V5XG5jb25zdCBfa2V5TWFwOiB7W2s6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gIC8vIFRoZSBmb2xsb3dpbmcgdmFsdWVzIGFyZSBoZXJlIGZvciBjcm9zcy1icm93c2VyIGNvbXBhdGliaWxpdHkgYW5kIHRvIG1hdGNoIHRoZSBXM0Mgc3RhbmRhcmRcbiAgLy8gY2YgaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLWtleS9cbiAgJ1xcYic6ICdCYWNrc3BhY2UnLFxuICAnXFx0JzogJ1RhYicsXG4gICdcXHg3Ric6ICdEZWxldGUnLFxuICAnXFx4MUInOiAnRXNjYXBlJyxcbiAgJ0RlbCc6ICdEZWxldGUnLFxuICAnRXNjJzogJ0VzY2FwZScsXG4gICdMZWZ0JzogJ0Fycm93TGVmdCcsXG4gICdSaWdodCc6ICdBcnJvd1JpZ2h0JyxcbiAgJ1VwJzogJ0Fycm93VXAnLFxuICAnRG93bic6ICdBcnJvd0Rvd24nLFxuICAnTWVudSc6ICdDb250ZXh0TWVudScsXG4gICdTY3JvbGwnOiAnU2Nyb2xsTG9jaycsXG4gICdXaW4nOiAnT1MnXG59O1xuXG4vLyBUaGVyZSBpcyBhIGJ1ZyBpbiBDaHJvbWUgZm9yIG51bWVyaWMga2V5cGFkIGtleXM6XG4vLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MTU1NjU0XG4vLyAxLCAyLCAzIC4uLiBhcmUgcmVwb3J0ZWQgYXMgQSwgQiwgQyAuLi5cbmNvbnN0IF9jaHJvbWVOdW1LZXlQYWRNYXAgPSB7XG4gICdBJzogJzEnLFxuICAnQic6ICcyJyxcbiAgJ0MnOiAnMycsXG4gICdEJzogJzQnLFxuICAnRSc6ICc1JyxcbiAgJ0YnOiAnNicsXG4gICdHJzogJzcnLFxuICAnSCc6ICc4JyxcbiAgJ0knOiAnOScsXG4gICdKJzogJyonLFxuICAnSyc6ICcrJyxcbiAgJ00nOiAnLScsXG4gICdOJzogJy4nLFxuICAnTyc6ICcvJyxcbiAgJ1xceDYwJzogJzAnLFxuICAnXFx4OTAnOiAnTnVtTG9jaydcbn07XG5cblxuLyoqXG4gKiBSZXRyaWV2ZXMgbW9kaWZpZXJzIGZyb20ga2V5LWV2ZW50IG9iamVjdHMuXG4gKi9cbmNvbnN0IE1PRElGSUVSX0tFWV9HRVRURVJTOiB7W2tleTogc3RyaW5nXTogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBib29sZWFufSA9IHtcbiAgJ2FsdCc6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gZXZlbnQuYWx0S2V5LFxuICAnY29udHJvbCc6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gZXZlbnQuY3RybEtleSxcbiAgJ21ldGEnOiAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IGV2ZW50Lm1ldGFLZXksXG4gICdzaGlmdCc6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gZXZlbnQuc2hpZnRLZXlcbn07XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICogQSBicm93c2VyIHBsdWctaW4gdGhhdCBwcm92aWRlcyBzdXBwb3J0IGZvciBoYW5kbGluZyBvZiBrZXkgZXZlbnRzIGluIEFuZ3VsYXIuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBLZXlFdmVudHNQbHVnaW4gZXh0ZW5kcyBFdmVudE1hbmFnZXJQbHVnaW4ge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGJyb3dzZXIgcGx1Zy1pbi5cbiAgICogQHBhcmFtIGRvYyBUaGUgZG9jdW1lbnQgaW4gd2hpY2gga2V5IGV2ZW50cyB3aWxsIGJlIGRldGVjdGVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgZG9jOiBhbnkpIHtcbiAgICBzdXBlcihkb2MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgd2hldGhlciBhIG5hbWVkIGtleSBldmVudCBpcyBzdXBwb3J0ZWQuXG4gICAqIEBwYXJhbSBldmVudE5hbWUgVGhlIGV2ZW50IG5hbWUgdG8gcXVlcnkuXG4gICAqIEByZXR1cm4gVHJ1ZSBpZiB0aGUgbmFtZWQga2V5IGV2ZW50IGlzIHN1cHBvcnRlZC5cbiAgICovXG4gIHN1cHBvcnRzKGV2ZW50TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEtleUV2ZW50c1BsdWdpbi5wYXJzZUV2ZW50TmFtZShldmVudE5hbWUpICE9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgaGFuZGxlciBmb3IgYSBzcGVjaWZpYyBlbGVtZW50IGFuZCBrZXkgZXZlbnQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBIVE1MIGVsZW1lbnQgdG8gcmVjZWl2ZSBldmVudCBub3RpZmljYXRpb25zLlxuICAgKiBAcGFyYW0gZXZlbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBrZXkgZXZlbnQgdG8gbGlzdGVuIGZvci5cbiAgICogQHBhcmFtIGhhbmRsZXIgQSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIG5vdGlmaWNhdGlvbiBvY2N1cnMuIFJlY2VpdmVzIHRoZVxuICAgKiBldmVudCBvYmplY3QgYXMgYW4gYXJndW1lbnQuXG4gICAqIEByZXR1cm5zIFRoZSBrZXkgZXZlbnQgdGhhdCB3YXMgcmVnaXN0ZXJlZC5cbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIoZWxlbWVudDogSFRNTEVsZW1lbnQsIGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICBjb25zdCBwYXJzZWRFdmVudCA9IEtleUV2ZW50c1BsdWdpbi5wYXJzZUV2ZW50TmFtZShldmVudE5hbWUpITtcblxuICAgIGNvbnN0IG91dHNpZGVIYW5kbGVyID1cbiAgICAgICAgS2V5RXZlbnRzUGx1Z2luLmV2ZW50Q2FsbGJhY2socGFyc2VkRXZlbnRbJ2Z1bGxLZXknXSwgaGFuZGxlciwgdGhpcy5tYW5hZ2VyLmdldFpvbmUoKSk7XG5cbiAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmdldFpvbmUoKS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0RE9NKCkub25BbmRDYW5jZWwoZWxlbWVudCwgcGFyc2VkRXZlbnRbJ2RvbUV2ZW50TmFtZSddLCBvdXRzaWRlSGFuZGxlcik7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcGFyc2VFdmVudE5hbWUoZXZlbnROYW1lOiBzdHJpbmcpOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfXxudWxsIHtcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBldmVudE5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpO1xuXG4gICAgY29uc3QgZG9tRXZlbnROYW1lID0gcGFydHMuc2hpZnQoKTtcbiAgICBpZiAoKHBhcnRzLmxlbmd0aCA9PT0gMCkgfHwgIShkb21FdmVudE5hbWUgPT09ICdrZXlkb3duJyB8fCBkb21FdmVudE5hbWUgPT09ICdrZXl1cCcpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBLZXlFdmVudHNQbHVnaW4uX25vcm1hbGl6ZUtleShwYXJ0cy5wb3AoKSEpO1xuXG4gICAgbGV0IGZ1bGxLZXkgPSAnJztcbiAgICBNT0RJRklFUl9LRVlTLmZvckVhY2gobW9kaWZpZXJOYW1lID0+IHtcbiAgICAgIGNvbnN0IGluZGV4OiBudW1iZXIgPSBwYXJ0cy5pbmRleE9mKG1vZGlmaWVyTmFtZSk7XG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICBwYXJ0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBmdWxsS2V5ICs9IG1vZGlmaWVyTmFtZSArICcuJztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBmdWxsS2V5ICs9IGtleTtcblxuICAgIGlmIChwYXJ0cy5sZW5ndGggIT0gMCB8fCBrZXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyByZXR1cm5pbmcgbnVsbCBpbnN0ZWFkIG9mIHRocm93aW5nIHRvIGxldCBhbm90aGVyIHBsdWdpbiBwcm9jZXNzIHRoZSBldmVudFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiB7W2s6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICByZXN1bHRbJ2RvbUV2ZW50TmFtZSddID0gZG9tRXZlbnROYW1lO1xuICAgIHJlc3VsdFsnZnVsbEtleSddID0gZnVsbEtleTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc3RhdGljIGdldEV2ZW50RnVsbEtleShldmVudDogS2V5Ym9hcmRFdmVudCk6IHN0cmluZyB7XG4gICAgbGV0IGZ1bGxLZXkgPSAnJztcbiAgICBsZXQga2V5ID0gZ2V0RXZlbnRLZXkoZXZlbnQpO1xuICAgIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChrZXkgPT09ICcgJykge1xuICAgICAga2V5ID0gJ3NwYWNlJzsgIC8vIGZvciByZWFkYWJpbGl0eVxuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnLicpIHtcbiAgICAgIGtleSA9ICdkb3QnOyAgLy8gYmVjYXVzZSAnLicgaXMgdXNlZCBhcyBhIHNlcGFyYXRvciBpbiBldmVudCBuYW1lc1xuICAgIH1cbiAgICBNT0RJRklFUl9LRVlTLmZvckVhY2gobW9kaWZpZXJOYW1lID0+IHtcbiAgICAgIGlmIChtb2RpZmllck5hbWUgIT0ga2V5KSB7XG4gICAgICAgIGNvbnN0IG1vZGlmaWVyR2V0dGVyID0gTU9ESUZJRVJfS0VZX0dFVFRFUlNbbW9kaWZpZXJOYW1lXTtcbiAgICAgICAgaWYgKG1vZGlmaWVyR2V0dGVyKGV2ZW50KSkge1xuICAgICAgICAgIGZ1bGxLZXkgKz0gbW9kaWZpZXJOYW1lICsgJy4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgZnVsbEtleSArPSBrZXk7XG4gICAgcmV0dXJuIGZ1bGxLZXk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlcyBhIGhhbmRsZXIgY2FsbGJhY2sgZm9yIGEga2V5IGV2ZW50LlxuICAgKiBAcGFyYW0gZnVsbEtleSBUaGUgZXZlbnQgbmFtZSB0aGF0IGNvbWJpbmVzIGFsbCBzaW11bHRhbmVvdXMga2V5c3Ryb2tlcy5cbiAgICogQHBhcmFtIGhhbmRsZXIgVGhlIGZ1bmN0aW9uIHRoYXQgcmVzcG9uZHMgdG8gdGhlIGtleSBldmVudC5cbiAgICogQHBhcmFtIHpvbmUgVGhlIHpvbmUgaW4gd2hpY2ggdGhlIGV2ZW50IG9jY3VycmVkLlxuICAgKiBAcmV0dXJucyBBIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgc3RhdGljIGV2ZW50Q2FsbGJhY2soZnVsbEtleTogYW55LCBoYW5kbGVyOiBGdW5jdGlvbiwgem9uZTogTmdab25lKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoZXZlbnQ6IGFueSAvKiogVE9ETyAjOTEwMCAqLykgPT4ge1xuICAgICAgaWYgKEtleUV2ZW50c1BsdWdpbi5nZXRFdmVudEZ1bGxLZXkoZXZlbnQpID09PSBmdWxsS2V5KSB7XG4gICAgICAgIHpvbmUucnVuR3VhcmRlZCgoKSA9PiBoYW5kbGVyKGV2ZW50KSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgc3RhdGljIF9ub3JtYWxpemVLZXkoa2V5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPOiBzd2l0Y2ggdG8gYSBNYXAgaWYgdGhlIG1hcHBpbmcgZ3Jvd3MgdG9vIG11Y2hcbiAgICBzd2l0Y2ggKGtleU5hbWUpIHtcbiAgICAgIGNhc2UgJ2VzYyc6XG4gICAgICAgIHJldHVybiAnZXNjYXBlJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBrZXlOYW1lO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFdmVudEtleShldmVudDogYW55KTogc3RyaW5nIHtcbiAgbGV0IGtleSA9IGV2ZW50LmtleTtcbiAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAga2V5ID0gZXZlbnQua2V5SWRlbnRpZmllcjtcbiAgICAvLyBrZXlJZGVudGlmaWVyIGlzIGRlZmluZWQgaW4gdGhlIG9sZCBkcmFmdCBvZiBET00gTGV2ZWwgMyBFdmVudHMgaW1wbGVtZW50ZWQgYnkgQ2hyb21lIGFuZFxuICAgIC8vIFNhZmFyaSBjZlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDcvV0QtRE9NLUxldmVsLTMtRXZlbnRzLTIwMDcxMjIxL2V2ZW50cy5odG1sI0V2ZW50cy1LZXlib2FyZEV2ZW50cy1JbnRlcmZhY2VzXG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJ1VuaWRlbnRpZmllZCc7XG4gICAgfVxuICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnVSsnKSkge1xuICAgICAga2V5ID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChrZXkuc3Vic3RyaW5nKDIpLCAxNikpO1xuICAgICAgaWYgKGV2ZW50LmxvY2F0aW9uID09PSBET01fS0VZX0xPQ0FUSU9OX05VTVBBRCAmJiBfY2hyb21lTnVtS2V5UGFkTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgLy8gVGhlcmUgaXMgYSBidWcgaW4gQ2hyb21lIGZvciBudW1lcmljIGtleXBhZCBrZXlzOlxuICAgICAgICAvLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MTU1NjU0XG4gICAgICAgIC8vIDEsIDIsIDMgLi4uIGFyZSByZXBvcnRlZCBhcyBBLCBCLCBDIC4uLlxuICAgICAgICBrZXkgPSAoX2Nocm9tZU51bUtleVBhZE1hcCBhcyBhbnkpW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9rZXlNYXBba2V5XSB8fCBrZXk7XG59XG4iXX0=