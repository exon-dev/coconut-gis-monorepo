export default function slugger(path) {
    return path.replace(" ", "-").toLowerCase();
}
