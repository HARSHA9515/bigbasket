const express = require ('express')

const {  users, authenticateToken, login, logout} = require('./auth')

const app = express()

const port = 3000;

app.use(express.json());

let products =[
    {id:1, name:'Product 1', price: 100},
    {id:2, name:'Product 2', price: 200},
    {id:3, name:'Product 3', price: 200},
    {id:4, name:'Product 4', price: 200},
    {id:5, name:'Product 5', price: 200},
];

app.post('/api/login', login);
app.post('/api/logout', authenticateToken, logout);

// to check admin role
function isAdmin(req,res,next){
    if(req.user.role !=='admin') return res.sendStatus(403);
    next();
}

//  all users(admin only)

app.get('/api/users', authenticateToken, isAdmin,(req,res)  =>{ 
    res.json(users);
});

// all products (available for users)
app.get('/api/products', authenticateToken,(req,res) =>{
    res.json(products);
})

// a single product by id
app.get('/api/products/:id', authenticateToken,(req,res) => {
    const product = products.find (p => p.id === parseInt(req.params.id));
    if(!product) return res.status(404).send ('product not found');
    res.json(product);
});

// create new product

app.post ('/api/products', authenticateToken,isAdmin,(req,res) =>{
    const newProduct ={
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// update product

app.put('/api/products/:id', authenticateToken,isAdmin,(req,res) =>{
    const product = products.find(p => p.id === parseInt(req.params.id));
    if(!product) return res.status(404).send('product not found');
    product.name =req.body.name;
    product.price = req.body.price;
    res.json(product);
});

// delete a product
app.delete('/api/products/:id', authenticateToken, isAdmin, (req,res)=>{
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send('product not found');

    const deletedProduct = product. splice(productIndex, 1);
    res.json(deletedProduct)
});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
})

