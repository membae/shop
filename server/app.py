from models import db,User,Product,Payment,OrderProducts,Review,Images,Order,Feature,Category,Tax
from flask_migrate import Migrate
from flask import Flask, request, make_response,jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager,create_access_token, create_refresh_token,jwt_required,get_jwt_identity
import secrets,datetime,os,json
from datetime import timedelta
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash,generate_password_hash
import cloudinary
import cloudinary.uploader
import cloudinary.api


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
    # "DB_URI", f"postgresql://robert:d0KU0b3VMlQkb6t4eH7qwyqUaNxDHdJx@dpg-csouttd6l47c73969tg0-a/gizmo_315a")

#upload images assist
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static')
ALLOWED_EXTENSIONS=set(['png','jpeg','jpg'])
def allowed_file(filename):
    return '.' in filename and filename.rsplit(".",1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] =secrets.token_hex(32)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER


migrate = Migrate(app, db)

db.init_app(app)
api=Api(app)
jwt=JWTManager(app)


# configure cloudinary for images upload
cloudinary.config(
    cloud_name="dnn1s0zce",
    api_key="125569871885264",
    api_secret="z5kCj4pWjV5c2gUbRw0kxHiSYq4"
)

# CORS(app, resources={r"/elections/*": {"origins": "https://electra-dummy-1.onrender.com"}})

class Home(Resource):
    def get(self):
        return make_response({"msg":"Homepage here"},200)
api.add_resource(Home,'/')

class Signup(Resource):
    def post(self):
        data=request.get_json()
        email=data.get("email")
        f_name=data.get("first_name")
        l_name=data.get("last_name")
        date=datetime.datetime.now()
        password=generate_password_hash(data.get("password"))
        role=data.get("role","Client")
        if "@" in email and f_name and f_name!=" " and l_name and l_name!=" " and role and role!=" " and data.get("password") and data.get("password")!=" ":
            user=User.query.filter_by(email=email).first()
            if user:
                return make_response({"msg":f"{email} is already registered"},400)
            new_user=User(first_name=f_name,last_name=l_name,email=email,password=password,date_created=date,role=role,status="Active")
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(),201)
        return make_response({"msg":"Invalid data entries"},400)
api.add_resource(Signup,'/signup')

class Get_Users(Resource):
    @jwt_required()
    def get(self):
        users=User.query.all()
        return make_response([user.to_dict({"id":user.id,"email":user.email,'first_name':user.first_name,"last_name":user.last_name,"email":user.email,"role":user.role,'status':user.status}) for user in users],200)
api.add_resource(Get_Users,'/get-users')

class Login(Resource):
    def post(self):
        data=request.get_json()
        email=data.get("email")
        password=data.get("password")
        if "@" in email and password:
            user=User.query.filter_by(email=email).first()
            if user:
                if check_password_hash(user.password,password):
                    access_token=create_access_token(identity=user.id)
                    refresh_token=create_refresh_token(identity=user.id)
                    userData={"id":user.id,"role":user.role}
                    return make_response({"user":userData,"access_token":access_token,"refresh_token":refresh_token},200)
                return make_response({"msg":"Incorrect password"},400)
            return make_response({"msg":"email not registered"},404)
        return make_response({"msg":"Invalid data"})
api.add_resource(Login,'/login')

class User_By_Id(Resource):
    # @jwt_required()
    def get(self,id):
        user=User.query.filter_by(id=id).first()
        if user:
            return make_response(user.to_dict(),200)
        return make_response({"msg":"User not found"},400)
    
    @jwt_required()
    def delete(self,id):
        user=User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response({"msg":"User deleted successsfully"},204)
        return make_response({"msg":"User not found"},400)
    
    # @jwt_required()
    def patch(self,id):
        user=User.query.filter_by(id=id).first()
        if user:
            data=request.get_json()
            if not user:
                return make_response({"msg":"User not found"},404)
            first_name=data.get("first_name")
            last_name=data.get("last_name")
            password=data.get("password")
            balance=data.get("balance")
            earnings=data.get("earnings")
            role=data.get("role")

            if first_name and first_name!=" ":
                user.first_name=first_name
            if last_name and last_name!=" ":
                user.last_name=last_name
            if balance and balance!=" ":
                user.balance=balance
            if earnings and earnings!=" ":
                user.earnings=earnings
            if password and password!=" ":
                user.password=generate_password_hash(password)
            if role and role!=" ":
                user.role=role

            db.session.commit()
            return make_response(user.to_dict(),200)
api.add_resource(User_By_Id,'/user/<int:id>')

class Product_By_Id(Resource):
    def get(self,id):
        product=Product.query.filter_by(id=id).first()
        if product:
            print(product.product_reviews)
            return make_response(product.to_dict(),200)
        return make_response({"msg":"Product not found"},404)
    def delete(self,id):
        product=Product.query.filter_by(id=id).first()
        if product:
            db.session.delete(product)
            db.session.commit()
            return make_response({"msg":"Product deleted successfully"},204)
        return make_response({"msg":"Product not found"},404)
    def patch(self,id):
        product=Product.query.filter_by(id=id).first()
        if product:
            data=request.get_json()
            #update product attributes only
            for attr in data:
                if attr in ['name','description','category_id','purchase_price','selling_price','discount','quantity','tax_id']:
                    setattr(product,attr,data.get(attr))
                db.session.add(product)
                db.session.commit()
                if attr=='features':
                    for feature in data.get("features"):
                        new_feature=Feature(description=feature,product_id=product.id)
                        db.session.add(new_feature)
                        db.session.commit()
                if attr=='images':
                    for image in data.get("images"):
                        new_image=Images(image_url=image,product_id=product.id)
                        db.session.add(new_image)
                        db.session.commit()
            return make_response(product.to_dict(),200)
        return make_response({"msg":"Product not found"},404)
api.add_resource(Product_By_Id,'/product/<int:id>')

class Add_Get_Product(Resource):
    def get(self):
        products=Product.query.all()
        return make_response([product.to_dict() for product in products],200)
    
    @jwt_required()
    def post(self):
    # product data contains files and json data
        files = request.files.getlist('file')  # gets all the files from the data that have a key of 'file'
        product_data = request.form.get('product_data')  # gets data saved under the key 'product_data'
        if product_data and len(files) > 0:
            data = json.loads(product_data)
            # Ensure that all required data is present, including discount
            required_fields = ["name", "description", "category_id", "purchase_price", "selling_price", "features", "discount"]
            if all(item in data for item in required_fields):
                product = Product.query.filter_by(name=data.get("name")).first()
                if product:
                    return make_response({"msg": "Product already exists"}, 400)

                # Ensure the discount field is valid
                discount = float(data.get("discount"))
                if discount < 0 or discount > 100:
                    return make_response({"msg": "Discount must be between 0 and 100"}, 400)

                # Process and upload images
                images = []
                for file in files:
                    if file.filename != '' and allowed_file(file.filename):
                        result = cloudinary.uploader.upload(file)
                        images.append(result.get("url"))  # populates the images array with the generated URL

                # Calculate prices excluding tax
                purchase_price = float(data.get("purchase_price"))
                selling_price = float(data.get("selling_price"))
                tax_id = data.get("tax_id")
                tax = Tax.query.filter_by(id=tax_id).first()
                if not tax:
                    purchase_price_excl_tax = purchase_price
                    selling_price_excl_tax = selling_price
                else:
                    rate = 1 + (tax.value) / 100
                    purchase_price_excl_tax = round(purchase_price / rate, 2)
                    selling_price_excl_tax = round(selling_price / rate, 2)

                # Create the new product
                new_product = Product(
                    name=data.get("name"),
                    description=data.get("description"),
                    category_id=data.get("category_id"),
                    purchase_price=purchase_price,
                    selling_price=selling_price,
                    purchase_price_excl_tax=purchase_price_excl_tax,
                    selling_price_excl_tax=selling_price_excl_tax,
                    discount=discount,  # Add the discount here
                    quantity=data.get("quantity", 0),
                    added_by=get_jwt_identity(),
                    tax_id=data.get("tax_id", None),
                    date_added=datetime.datetime.now()
                )
                db.session.add(new_product)
                db.session.commit()

                # Save images
                for image in images:
                    new_image = Images(image_url=image, product_id=new_product.id)
                    db.session.add(new_image)
                    db.session.commit()

                # Save features
                features = data.get("features")  # an array of product features
                for feature in features:
                    new_feature = Feature(description=feature, product_id=new_product.id)
                    db.session.add(new_feature)
                    db.session.commit()

                return make_response(new_product.to_dict(), 201)
            return make_response({"msg": "Required data missing"}, 400)
        return make_response({"msg": "Invalid data format"}, 400)

api.add_resource(Add_Get_Product, '/products')


class Create_Get_categories(Resource):
    def get(self):
        categories=Category.query.all()
        return make_response([category.to_dict() for category in categories],200)
    
    @jwt_required()
    def post(self):
        data=request.get_json()
        if 'name' in data and data.get("name") and "description" in data:
            category=Category.query.filter_by(name=data.get("name"),description=data.get("description")).first()
            if category:
                return make_response({"msg":"Category already exists"},400)
            new_category=Category(name=data.get("name"),description=data.get("description"))
            db.session.add(new_category)
            db.session.commit()
            return make_response(new_category.to_dict(),201)
        return make_response({"msg":"Required data is missing"},400)
api.add_resource(Create_Get_categories,'/categories')

class Category_By_Id(Resource):
    def get(self,id):
        category=Category.query.filter_by(id=id).first()
        if category:
            return make_response(category.to_dict(),200)
        return make_response({"msg":"Category not found"},400)
    
    @jwt_required()
    def delete(self,id):
        category=Category.query.filter_by(id=id).first()
        if category:
            db.session.delete(category)
            db.session.commit()
            return make_response({"msg":"Category deleted successfully"},204)
        return make_response({"msg":"Category not found"},400)
    
    @jwt_required()
    def patch(self,id):
        category=Category.query.filter_by(id=id).first()
        if category:
            data=request.get_json()
            if "name" in data and data.get("name") and "description" in data and data.get("description"):
                setattr(category,"name",data.get("name"))
                setattr(category,"description",data.get("description"))
                db.session.add(category)
                db.session.commit()
                return make_response(category.to_dict(),200)
            return make_response({"msg":"Required data is missing"},400)
        return make_response({"msg":"Category not found"},400)
api.add_resource(Category_By_Id,'/category/<int:id>')

class Create_Get_Tax_Category(Resource):
    def get(self):
        taxes=Tax.query.all()
        return make_response([tax.to_dict() for tax in taxes],200)
    
    @jwt_required()
    def post(self):
        data=request.get_json()
        if 'name' in data and 'value' in data:
            tax=Tax.query.filter_by(name=data.get("name")).first()
            if tax:
                return make_response({"msg":"Tax category already exists"},400)
            new_tax=Tax(name=data.get("name"),value=data.get("value"))
            db.session.add(new_tax)
            db.session.commit()
            return make_response(new_tax.to_dict(),201)
        return make_response({"msg":"Required data is missing"},400)
api.add_resource(Create_Get_Tax_Category,'/tax-category')

class Tax_Category_By_Id(Resource):
    def get(self,id):
        tax=Tax.query.filter_by(id=id).first()
        if tax:
            return make_response(tax.to_dict(),200)
        return make_response({"msg":"Tax not found"},400)
    
    @jwt_required()
    def delete(self,id):
        tax=Tax.query.filter_by(id=id).first()
        if tax:
            db.session.delete(tax)
            db.session.commit()
            return make_response({"msg":"Tax category deleted"},204)
        return make_response({"msg":"Tax not found"},400)
    
    @jwt_required()
    def patch(self,id):
        tax=Tax.query.filter_by(id=id).first()
        if tax:
            data=request.get_json()
            if "name" in data and "value" in data:
                setattr(tax,"name",data.get("name"))
                setattr(tax,"value",data.get("value"))
                db.session.commit()
                return make_response(tax.to_dict(),200)
            return make_response({"msg":"Required data is missing"},400)
        return make_response({"msg":"Tax not found"},400)
api.add_resource(Tax_Category_By_Id,'/tax-category/<int:id>')
    
class Create_Get_Order(Resource):
    @jwt_required()
    #get all orders
    def get(self):
        orders=Order.query.all()
        return make_response([order.to_dict() for order in orders],200)
    
    @jwt_required()
    #create a new order
    def post(self):
        data=request.get_json()
        if all(attr in data for attr in ['amount','shipping_address','products',"taxes"]):
            new_order=Order(amount=data.get("amount"),status="Pending",taxes=data.get("taxes"),shipping_address=data.get("shipping_address"),
                            date=datetime.datetime.now(),user_id=get_jwt_identity())
            db.session.add(new_order)
            db.session.commit()
            products=data.get("products") #an array of product details that are specific to the order created above
            for item in products:
                new_order_product=OrderProducts(product_id=item.get("product_id"),quantity=item.get("quantity"),order_id=new_order.id)
                db.session.add(new_order_product)
                db.session.commit()
            return make_response(new_order.to_dict(),201)
        return make_response({"msg":"Required data is missing"},400)
api.add_resource(Create_Get_Order,'/orders')

class Order_By_Id(Resource):
    @jwt_required()
    def get(self,id):
        order=Order.query.filter_by(id=id).first()
        if order:
            return make_response(order.to_dict(),200)
        return make_response({"msg":"Order not found"},400)
    
    @jwt_required()
    def delete(self,id):
        order=Order.query.filter_by(id=id).first()
        if order:
            db.session.delete(order)
            db.session.commit()
            return make_response({"msg":"Order deleted successfully"},204)
        return make_response({"msg":"Order not found"},400)
    
    @jwt_required()
    def patch(self,id):
        order=Order.query.filter_by(id=id).first()
        if order:
            data=request.get_json()
            # if "status" not in data or 'payment' not in data:
            #     return make_response({"msg":"Required data is missing"},400)
            for attr in data:
                setattr(order,attr,data.get(attr))
            db.session.commit()
            return make_response(order.to_dict(),200)
        return make_response({"msg":"Order not found"},400)
api.add_resource(Order_By_Id,'/order/<int:id>')

class Create_Get_Review(Resource):
    def get(self):
        reviews=Review.query.all()
        return make_response([response.to_dict() for response in reviews],200)
    
    @jwt_required()
    def post(self):
        data=request.get_json()
        if 'rating' in data and 'description' in data and 'product_id' in data and 1<=data.get("rating")<=5:
            product=Product.query.filter_by(id=id).first()
            if not product:
                return make_response({"msg":"Product does not exist"},400)
            new_review=Review(rating=data.get("rating"),description=data.get("description"),
                              user_id=get_jwt_identity(),product_id=data.get("product_id"),date_created=datetime.datetime.now())
            db.session.add(new_review)
            db.session.commit()
            return make_response(new_review.to_dict(),201)
        return make_response({"msg":"Required data is missing"},400)
api.add_resource(Create_Get_Review,'/reviews')


if __name__=="__main__":
    app.run(debug=True)