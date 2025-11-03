from PIL import Image

img = Image.new('RGB', (600, 600), color = 'blue')
img.save('public/default-globe.jpg')
