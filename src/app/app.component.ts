import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.configureKeyboard();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private configureKeyboard() {
    Keyboard.hideKeyboardAccessoryBar(false);

    if (this.platform.is('ios')) {
      let keyBoardOpen : boolean = false; // Will be true when keyboard is open
      let offsetY; // Tapped Y co-ordinate from bottom
      Keyboard.disableScroll(true);
      let paddingAdded = 0;
      window.addEventListener('native.keyboardshow', function(e){
        
        let nearestContentTop = 0;
        let inputTop = 0;
        // Get the active element's y co-ordinate.
        inputTop = document.activeElement.parentElement.getBoundingClientRect().top+document.activeElement.parentElement.getBoundingClientRect().height;
        // AS the keyboard is already shown, the total height = innderHeight + keyboardHeight
        if (inputTop > window.innerHeight) {
          offsetY = (window.innerHeight + e['keyboardHeight']) - inputTop;
        } else {
          offsetY = (window.innerHeight + e['keyboardHeight']) - inputTop + 100;
        }
        let scrollEl = document.activeElement.closest('.scroll-content');
        if(scrollEl) {
          nearestContentTop = parseInt(scrollEl['style'].marginTop.slice(0, -2));
        }

        let keyboardHeight = e['keyboardHeight'];

        let bodyMove = document.querySelector("ion-app");
        let bodyMoveStyle = bodyMove['style'];
        if (offsetY < keyboardHeight + 40) {
          bodyMoveStyle.bottom = (paddingAdded ? paddingAdded + keyboardHeight - offsetY : keyboardHeight - offsetY + 40) + "px";
          paddingAdded = paddingAdded ? paddingAdded + keyboardHeight - offsetY : keyboardHeight - offsetY + 40;
          bodyMoveStyle.top = "initial";
        }
        keyBoardOpen = true;
      });

      window.addEventListener('native.keyboardhide', function(e){
        paddingAdded = 0;
        let removeStyles = document.querySelector("ion-app");
        removeStyles.removeAttribute("style");
        keyBoardOpen = false;
      });

      // On touch, collect the Y co-ordinate so that the bottom of the body can be padded when keyboard opens up.
      window.addEventListener('touchstart', function(e){
        let clientYPosition = e['touches'][0].clientY;
        let height = window.innerHeight;
        offsetY = (height - clientYPosition);
      });
    }
  }
}
