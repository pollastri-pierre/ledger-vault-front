export default function() {
  let commitHash = require("child_process")
    .execSync("git rev-parse --short HEAD")
    .toString();
  commitHash = commitHash.substring(0, commitHash.length - 1);
  return commitHash;
}
