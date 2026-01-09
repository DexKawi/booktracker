export function Form({ type }) {
    const forms = {
        add: "null"
    }
    return forms[type]
}