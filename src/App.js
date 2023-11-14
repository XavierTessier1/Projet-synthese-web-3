/**
 * @module App
*/
/*
==========================================================
Matricule : TESX2139676
Projet synthèse Web A2022
==========================================================
*/
export default class App {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
		console.log("Je suis prêt");
		var app = document.getElementById("app");
		var grid = document.querySelector(".grid");

		this.chargerJson("https://magasin.mboudrea.tim-cstj.ca/api/produit/alea/6").then(donnees => {
			// console.log(donnees);
			var listeProduits = this.html_listeProduits(donnees.produits);
			var vieux = document.querySelector(".grid");
			vieux.replaceWith(listeProduits);
		});

		var form = document.getElementById("recherche");
		form.addEventListener("submit", e => {
			var mot = form.recherche.value;
			alert(mot);
			this.chargerJson("https://magasin.mboudrea.tim-cstj.ca/api/produit/recherche/?q="+mot).then(donnees => {
				var listeProduits = this.html_listeProduits(donnees.produits);
				var vieux = document.querySelector(".grid");
				vieux.replaceWith(listeProduits);
			});
		});
		// this.updateListe();
		// app.innerHTML = "La page est chargée";
	}

	// static updateListe() {
	// 	var vielleListe = document.querySelector("grid");
	// 	var nouvelleListe = this.html_listeProduits();
	// 	vielleListe.replaceWith(nouvelleListe);
	// }

	static html_listeProduits(tproduits) {
		// console.log(tproduits);
		var resultat = document.createElement("div");
		resultat.classList.add("grid");

		for (let i = 0; i < tproduits.length; i++) {
			let objProduit = tproduits[i];
			resultat.appendChild(this.html_produit(objProduit));

		}

		return resultat;
	}	

	static html_produit(objProduit) {
		// console.log(objProduit);
		var resultat = document.createElement("article");
		resultat.classList.add("produit");
		resultat.appendChild(this.html_nom(objProduit.titre));
		resultat.appendChild(this.html_image(objProduit.image.url, objProduit.titre));
		resultat.appendChild(this.html_prix(objProduit.prix));
		resultat.appendChild(this.html_bouton());

		resultat.addEventListener("click", e => {
			
			this.chargerJson(objProduit.url).then(donnees => {
				console.log(donnees);
				var backdrop = this.html_backdrop(donnees);
				document.body.appendChild(backdrop);

				backdrop.addEventListener("click", e => {
					backdrop.remove();
				});
			});

		});
		return resultat;
	}

	static html_backdrop(objProduit) {
		var resultat = document.createElement("div");
		resultat.id = "backdrop";
		var article = resultat.appendChild(document.createElement("article"));

		article.appendChild(this.html_backdropInfo(objProduit));
		article.appendChild(this.html_backdropImages(objProduit.images));

		return resultat;
	}

	static html_backdropInfo(objProduit) {
		var resultat = document.createElement("div");
		resultat.classList.add("description");

		var nom = resultat.appendChild(document.createElement("p"));
		nom.id = "nom";
		nom.innerHTML = objProduit.titre;

		var description = resultat.appendChild(document.createElement("p"));
		description.id = "description";
		description.innerHTML = objProduit.description;
		console.log(objProduit);

		var prix = resultat.appendChild(document.createElement("p"));
		prix.id = "prix";
		prix.innerHTML = objProduit.prix;

		resultat.appendChild(this.html_bouton());

		return resultat;

	}

	static html_backdropImages(tImages) {
		var resultat = document.createElement("div");
		resultat.classList.add("images");

		var img = resultat.appendChild(document.createElement("img"));
		
		if (tImages.length === 0) {
			img.src = "images/vide.svg";
		}
		else {
			img.src = tImages[0][400].url;
		}

		var changementImages = resultat.appendChild(document.createElement("div"));
		changementImages.id = "changementImages";

		for (let i = 0; i < tImages.length; i++) {
			const image = tImages[i];

			let div = changementImages.appendChild(document.createElement("div"));
			div.classList.add("petiteImage");

			let pImg = div.appendChild(document.createElement("img"));
			pImg.src = image[200].url;

			pImg.addEventListener("click", e => {
				e.stopPropagation();
				img.src = image[400].url;
			});
		}


		return resultat;
	}

	static html_image(url, alt) {
		var resultat = document.createElement("img");

		if (url === "") {
			resultat.src = "images/vide.svg";
		}
		else {
			resultat.src = url;
		}
		resultat.alt = alt;
		return resultat;
	}
	
	static html_nom(nom) {
		var resultat = document.createElement("h5");
		resultat.classList.add("nom");
		resultat.innerHTML = nom;
		return resultat;
	}

	static html_prix(prix) {
		var resultat = document.createElement("h3");
		resultat.classList.add("prix");
		resultat.innerHTML = prix;
		return resultat;
	}

	static html_bouton() {
		var resultat = document.createElement("button");
		resultat.classList.add("ajouterPanier");
		resultat.innerHTML = "Ajouter au panier";
		return resultat;
	}

	static chargerJson(url) {
		return new Promise(resolve => {
			var xhr = new XMLHttpRequest();
			xhr.open("get", url);
			xhr.responseType = "json";
			xhr.addEventListener("load", e => {
				resolve(e.target.response); // Retourne les données
			});
			xhr.send();
		});
	}
	/**
	 * Méthode qui permet d'attendre le chargement de la page avant d'éxécuter le script principal
	 * @returns undefined Ne retourne rien
	 */
	static init() {
		window.addEventListener("load", () => {
			this.main();
		});
	}
}
App.init();
