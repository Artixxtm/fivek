

class ProductService{
    async uploadImage(images){
        if (!images || images.length === 0) return null;

        let files = [];

        for (let i = 0; i <= images.length - 1; i++) {
            const base64Image = images[i];

            if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64Image)) {
                console.error("Invalid Base64 format", i);
                continue;
            }

            const payload = new URLSearchParams();
            payload.append("image", base64Image);

            let resp = await fetch(`${process.env.API_IMG_URL}?key=${process.env.API_IMG_KEY}`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: payload
            });

            let data = await resp.json()

            if (data.success) {
                files.push(data.data.image.url);
            } else {
                console.error("Image upload failed:", data);
            }
        }
        return files;
    }
}

module.exports = new ProductService();
