export function generateRandomColor() {
    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
    return `#${randomColor.getHexString()}`;
}
  
export function get_color(index) {
    const colors = ['#FC7A1E', '#B0E298', '#E072A4', '#82A6B1', '#353831', '#2AB7CA', ]
    return colors[index]
}