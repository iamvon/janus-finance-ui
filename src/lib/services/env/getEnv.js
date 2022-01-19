export const getNextEnv = (name) => {
    const NAME = name.toString()
    return process.env[`NEXT_PUBLIC_${NAME}`]
}
