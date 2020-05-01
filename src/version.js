export const packageVersion = process.env.npm_package_version;
export const gitVersion = process.env.GIT_DESCRIBE;

console.log(packageVersion, gitVersion);
