/*
 * Globals
 */


/* Custom default button */
.btn-secondary,
.btn-secondary:hover,
.btn-secondary:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from `body` */
}


/*
 * Base structure
 */

body {
  text-shadow: 0 .05rem .1rem rgba(0, 0, 0, .5);
  box-shadow: inset 0 0 5rem rgba(0, 0, 0, .5);
	background-color: black;
  color: white;
  margin: 5px;
}

main{
    border: 2em double;
    border-color: white;
}

h3 {

  font-size: 0.8em;

}

.cover-container {
  max-width: 42em;
}

input {

  border-radius: 5px;
  border-style: none;
  /* margin: 5px; */

}

button {

  border-radius: 100px;
  border-style: none;
  /* margin: 5px; */

}

label {

    text-align: right;
    font-size: 0.8em;

}

.row {

  margin: 5px;

}

.video-notes-field {

  font-size: .8em;

}

textarea {

  border-radius: 5px;
  border-style: none;

}

.pulled-detail{
  
  margin: 0;

}


/*
 * Header
 */

.nav-masthead .nav-link {
  padding: .25rem 0;
  font-weight: 700;
  color: rgba(255, 255, 255, .5);
  background-color: transparent;
  border-bottom: .25rem solid transparent;
}

.nav-masthead .nav-link:hover,
.nav-masthead .nav-link:focus {
  border-bottom-color: rgba(255, 255, 255, .25);
}

.nav-masthead .nav-link + .nav-link {
  margin-left: 1rem;
}

.nav-masthead .active {
  color: #fff;
  border-bottom-color: #fff;
}

/*
 *Link Styles
 */
.white-link{
	color: white;
}

.bg-pink{
  background-color: rgb(230, 3, 214);
}

.text-white{
  color: white;
}

.single-line-text{
  margin: 5px;
}

.move-left {
    width: auto;
    box-shadow: none;
}
