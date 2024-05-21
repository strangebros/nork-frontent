export default function (file, success) {
    let reader = new FileReader();
    reader.onload = success;

    reader.readAsDataURL(file);  
}