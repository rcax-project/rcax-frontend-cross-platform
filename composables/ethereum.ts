import {abbreviateNumber} from "~/global/utils";
import {useConeEthPrice, useEthereumPriceMap, useSettings} from "~/composables/states";

export function ethereumInLocalCurrency(eth: number, abbreviate: boolean): string {
    let abb = "";
    let localeString = ""
    const currency = useSettings().value.currency.preferred;

    eth = eth / 1000000000000000000

    let price = eth * (useEthereumPriceMap().value.get(currency) ?? 0);

    if (isNaN(price)) {
        price = 0;
    }

    switch (currency) {
        case "AUD":
        case "CNY":
        case "INR":
        case "CAD":
        case "USD":
            localeString = "en-US";
            break;
        default:
            localeString = "nl-NL";
            break;
    }

    // Use the appropriate locale for currency formatting
    const formatterLocale = currency === 'USD' ? 'en-US' : localeString;
    
    if (abbreviate) {
        [price, abb] = abbreviateNumber(price);
        
        const currencyFormatter = new Intl.NumberFormat(formatterLocale, {
            style: "currency",
            currency,
            minimumFractionDigits: price >= 100 ? 0 : 2,
            maximumFractionDigits: price >= 100 ? 0 : 2,
        });
        
        // Format the price and append abbreviation
        const formatted = currencyFormatter.format(price);
        return formatted + abb;
    } else {
        // For non-abbreviated prices, use standard currency formatting
        const currencyFormatter = new Intl.NumberFormat(formatterLocale, {
            style: "currency",
            currency,
            minimumFractionDigits: price >= 100 ? 0 : 2,
            maximumFractionDigits: price >= 100 ? 0 : 2,
        });
        
        return currencyFormatter.format(price);
    }
}

export function gweiInLocalCurrency(eth: number): string {
    let localeString = ""
    const currency = useSettings().value.currency.preferred;

    let price = Number((eth * (useEthereumPriceMap().value.get(currency) ?? 0)).toPrecision(5));

    switch (currency) {
        case "AUD":
        case "CNY":
        case "INR":
        case "CAD":
        case "USD":
            localeString = "en-US";
            break;
        default:
            localeString = "nl-NL";
            break;
    }

    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    });

    let symbol = currencyFormatter.formatToParts(0)[0].value;

    if (symbol.startsWith("US")) {
        symbol = symbol.slice(2, symbol.length);
    }

    let fullString = `${symbol}${price.toLocaleString(localeString, { maximumFractionDigits: 9 })}`;

    let zeroDecimalsString = '';

    let skipLength = symbol.length + 3

    for (let i = skipLength; i < fullString.length; i++) {
        const char = fullString.charAt(i);

        if (/[1-9]/.test(char)) { // Stop when the character is a number higher than 0
            break;
        } else {
            zeroDecimalsString += char;
        }
    }

    const smallCharacters = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀"];

    let shortenedString = fullString.slice(symbol.length + 3, fullString.length);

    if (zeroDecimalsString.length > 1 && zeroDecimalsString.length < 10) {
        shortenedString = shortenedString.replace(zeroDecimalsString, smallCharacters[zeroDecimalsString.length + 1]);
    }

    shortenedString = `${fullString.slice(0, symbol.length + 3)}${shortenedString}`;

    return shortenedString;
}

export function coneToEth(cone: number): number {
    return cone * useConeEthPrice().value;
}
