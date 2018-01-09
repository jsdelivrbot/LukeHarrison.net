<!-- 
Web Designer Magazine - Build a Web Form with Great UX - Additional Content
Posted on 11th January 2018
-->

In January's edition of Web Designer Magazine, I've been lucky enough to have my 7th consecutive article featured. This one is called "Build a Web Form with Great UX", where you'll learn the techniques and best practices which will allow you to create a web form with a highly optimised UX. I hope you enjoy it.

<TWEET>

To support the article, I'd like to share some additional content which couldn't quite make the cut this month, as with print, you only have so many words to play with. These are a collection of useful UX takeaways which relate to certain steps. Alone, these aren't likely to make much sense, but if you're reading these alongside my article in Web Designer, you'll come to understand the thinking behind some of the things you'll be doing.

Each step number below corresponds to the same step in the article.

### Step 1

1) A common pattern is to make an input’s label show within the input via the placeholder attribute, but from a UX standpoint this is bad because as soon as the user starts writing they lose that label information. It’s much better to have a label element separate from the input which is always visible.

2) Placeholder attributes are best used to provide hints and/or examples of the expected format of the input’s value. In this case, we’re showing an example name.

### Step 2 

In the past with some validation systems, inputs with invalid values are only flagged when the user tries to submit the form. This can be annoying, especially on large forms, as the user then has to go back and fix everything. Flagging input errors as soon as they happen is much less annoying, as fixing sessions occur when your focus is already on the input in question.

### Step 7

Setting the input type to ‘tel’ means on mobile devices a numeric keyboard is automatically shown when the input is in focus. This is useful for inputs which only accept numeric values, and saves the user a bit of time as they don’t have to manually toggle keyboards.

### Step 8

This functionality makes the user’s data entry experience here a little smoother, as otherwise they would have to manually click to move between the 3 date of birth inputs.

### Step 9

Tooltips allow us to share information which is relevant to an input, but isn’t important enough to display permanently. In this instance, they contains answers to possible questions around why we are requesting this contact information.

### Step 10

Having a tooltip toggled by a click event, rather than a hover event, gives the user more control over its usage. They may want it to stay visible as a reference whilst inputting data for instance. 

### Step 11

1) By making the additional contact number input only visible if the user clicks the link, we’re keeping the user’s focus on the mandatory inputs, whilst still making them aware it exists.

2) If the majority of inputs are mandatory, rather than wasting space labelling them as such, just label the few optional inputs which aren’t. The same rule applies vice versa if there’s more optional than required.

### Step 13

1) In the past, questions with multiple answers have been represented by select inputs. This is still fine where there’s many different answers, but for questions with only a few answers, it makes sense to represent these options as radio inputs so the user can save a few clicks / taps by selecting their answer straight away.

2) By using the input’s label as a wrapping element, we’ve created a much larger click area to select the radio input, which is especially handy on smaller screens.

### Step 18

By adding support for a browser’s autocomplete functionality, the user gains the option to greatly increase their speed of data entry, making it more likely that they’ll complete the form.

### Step 19

A progress bar sets an expectation in the mind of the user of how much time and effort is required to complete the web form. It offers them a clear picture of where they are in the process, and what is still to come. This reduces panic and frustration and improves the chances of a conversion.

### Step 23 

Keeping the progress bar in view means the user will always have an idea of where they are and how much is left to go, without the inconvenience of having to scroll back up the page.