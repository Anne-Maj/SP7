
import './App.css';
import React, {useState} from 'react';
import {
  Link,
  Switch,
  Route,
  NavLink, 
  useRouteMatch,
  Prompt,
  useParams,
  useHistory
} from "react-router-dom";


function App({bookFacade}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let history = useHistory();

  const setLoginStatus = status => {
    setIsLoggedIn(status);
    history.push("/");
  };
  return (
    <div>
    <Header 
    loginMsg={isLoggedIn ? "Logout" : "Login"}
    isLoggedIn={isLoggedIn}
    />
<p></p>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/products">
        <Products bookFacade={bookFacade}/>
      </Route>
      <Route path="/add-book">
        <AddBook bookFacade={bookFacade}/>
      </Route>
      <Route path="/company">
        <Company />
      </Route>
      <Route path="/find-book">
        <FindBook bookFacade={bookFacade}/>
      </Route>  
        
      <Route path="*">
        <NoMatch />
      </Route>
      <Route path="/login-out">
        <Login
        loginMsg={isLoggedIn ? "Logout" : "Login"}
        isLoggedIn={isLoggedIn}
        setLoginStatus={setLoginStatus}
        />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
    
  </div>
  
  );
}

function Header({isLoggedIn, loginMsg}) {
  return (
    <ul className="header">
    <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
    <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>
    <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>

   {isLoggedIn && (
     <React.Fragment>
    <li><NavLink activeClassName="active" to="/add-book">Add Book</NavLink></li>
    
    <li><NavLink activeClassName="active" to="/find-book">Find Book</NavLink></li>
    </React.Fragment>
   )}

    <li><NavLink activeClassName="active" to="/login-out">{loginMsg}</NavLink></li>
    
  </ul>
  
  );
}





function Products({bookFacade}) {
  const books = bookFacade.getBooks();
  let {path, url}=useRouteMatch();
  const lis = books.map(book =>{
    return (
      <li key={book.id}>
        {book.title}
        &nbsp;
        <Link to={`${url}/${book.id}`}>details</Link>
      </li>
    );
  });
    
  return (
    <div>
      <h2>Products</h2>
      <p>Amount of Books: {bookFacade.length}</p>
      <ul>{lis}</ul>
      <p>------------------------------------------------------</p>

      <Switch>
        <Route exact path = {path}>
          <h3>Please select a book</h3>
        </Route>
        <Route path={`${path}/:bookId`}>
        <Details bookFacade={bookFacade} />
        </Route>
      </Switch>
    </div>
    
  );
        }


  function Details({bookFacade}){
    const {bookId} = useParams();
    const book = bookFacade.findBook(bookId);

    const showBook = book ? (
      <div>
        <p>Title: {book.title}</p>
        <p>ID: {book.id}</p>
        <p>Info: {book.info}</p>
      </div>
    ) : (
      <p>Book not found</p>
    );
    return (
      <div>
        {showBook}
      </div>
    )
  }


function AddBook(props){
 
  const initialState = {id: "", title:"", info: ""};
  const [book, setBook] = useState(initialState)
 let [isBlocking, setIsBlocking]= useState(false);

  const handleInput = (event)=>{
const target = event.target;
const id = target.id;
const value = target.value;
setBook({...book, [id]: value})
setIsBlocking(true);

  }
  const handleSubmit = (evt)=>{
     evt.preventDefault(); 
   props.bookFacade.addBook(book);
   setBook({id:"", title:"", info:""})
   setIsBlocking(false);
  };

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit} onChange={handleInput}>
  <label>
  <input id="title" type="text" placeholder="Add Title" value={props.title} /><br></br>
    <input id="info" type="text" placeholder="Add Info" value={props.info} />
  </label><br></br>
  <button onClick= {handleSubmit}>Save</button>
</form>
<Prompt
when={isBlocking}
message={location =>
`You have unsaved changes. Are you sure you want to go to ${location.pathname}`
}
/>
<p>{JSON.stringify(book)}</p>
    </div>
  )
}



function FindBook({bookFacade}) {
  const [bookId, setBookId] = useState("");
  const[book, setBook] = useState(null);

  const findBook = () => {
    const foundBook = bookFacade.findBook(bookId);
    setBook(foundBook);
  };
  const deleteBook = id => {
    bookFacade.deleteBook(id);
    setBook(null);
  };
  return (
    <div style={{margin: 4}}>
<input id="book-id" placeholder= "Enter book id" onChange={e=>{setBookId(e.target.value)}}/>

<button onClick={findBook}>Find Book</button>

{book && (
  <div>
    <p>ID: {book.id}</p>
    <p>Title: {book.title}</p>
    <p>Info: {book.info}</p>
    <div>
    <button onClick={() => deleteBook(book.id)}>Delete Book</button>
    </div>
    </div>
)}
{!book && <p>Enter id for book to see</p>}
    </div>
  );

}


function Login({isLoggedIn, loginMsg, setLoginStatus}) {
  const handleBtnClick = () => {
    setLoginStatus(!isLoggedIn);
  };
  return (
    <div>
      <h2>
        {loginMsg}
      </h2>
      <em>this simulates a real login page. Here you just need to press the button</em>
    <br/>
    <button onClick={handleBtnClick}>{loginMsg}</button>

    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Company() {
  return (
    <div>
      <h2>Company</h2>
    </div>
  );
}


function NoMatch(){
  return (
    <div>
      <h2>No Match found for this URL</h2>
    </div>
  )
}



export default App;