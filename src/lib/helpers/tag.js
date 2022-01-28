export const renderTagName = (name) => {
    let str = name.replace(/-/g, " ")
    str = str.replace(/_/g, " ")
    str = str.charAt(0).toUpperCase() + str.slice(1)
    return str.trim()
}