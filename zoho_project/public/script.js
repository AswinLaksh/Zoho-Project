// document.querySelector(".email").addEventListener('keyup', (input) => {
//   const email = input.target.value;
//   console.log(email);
//   const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   if (!regex.test(email)) {
//     document.getElementById("email-error").innerHTML = "Enter a valid email";
//     document.getElementById("email-error").style.color = "red";
//   } else {
//     document.getElementById("email-error").innerHTML = "";
//   }
// });



// document.getElementById("number").addEventListener('input', (input) => {
//   const val = parseInt(input.target.value);
//   console.log(val);
//   const min = document.getElementById('number').dataset.min;
//   if (min && val < min) {
//     document.getElementById("number-error").innerHTML = "Minimum :" + min;
//     document.getElementById("number-error").style.color = "red";
//   }
//   else {
//     document.getElementById("number-error").innerHTML = "";
//   }
// })

// document.getElementById("array").addEventListener("input", (input) => {
//   const array = input.target.value.split(",");
//   console.log(array);
//   input.target.value = array;
//   console.log(input.target.value);
// })

const propKeys = JSON.parse(document.querySelector(".form-contents").dataset.content);
for (let propKey in propKeys) {
    const type = propKeys[propKey].type;
    const format = propKeys[propKey].format;
    if (type === "string") {
        if(format==="email"){
            document.getElementById(propKey).addEventListener('keyup', (input) => {
            const email = input.target.value;
            console.log(email);
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(email)) {
                document.getElementById(propKey+"-error").innerHTML = "Enter a valid email";
                document.getElementById(propKey+"-error").style.color = "red";
            } else {
                document.getElementById(propKey+"-error").innerHTML = "";
            }
            })
        }
        else{
            document.getElementById(propKey).addEventListener('keyup',(input)=>{
                const minLength = propKeys[propKey].minLength;
                const maxLength = propKeys[propKey].maxLength;
                const val = input.target.value.length;
                if(minLength && maxLength && (val<minLength || val>maxLength)){
                    document.getElementById(propKey+"-error").innerHTML = "Length out of range: required "+minLength+" to "+maxLength;
                    document.getElementById(propKey+"-error").style.color="red";
                }
                else if(minLength && minLength>val){
                    document.getElementById(propKey+"-error").innerHTML = "Too short";
                    document.getElementById(propKey+"-error").style.color="red";
                }
                else if(maxLength && maxLength<val){
                    document.getElementById(propKey+"-error").innerHTML = "Too long";
                    document.getElementById(propKey+"-error").style.color="red";
                }
                else{
                    document.getElementById(propKey+"-error").innerHTML = "";
                }

            })
        }
    }
    else if(type==="number"){
        document.getElementById(propKey).addEventListener('input',(input)=>{
            const val = parseInt(input.target.value);
            const min = propKeys[propKey].minimum;
            const max = propKeys[propKey].maximum;
            if(min && max && (min>val || val>max)){
                document.getElementById(propKey+"-error").innerHTML = "Value is out of range: required "+min+" to "+max;
                document.getElementById(propKey+"-error").style.color="red";
            }
            else if(min && min>val){
                document.getElementById(propKey+"-error").innerHTML = "Too small";
                document.getElementById(propKey+"-error").style.color="red";
            }
            else if(max && max<val){
                document.getElementById(propKey+"-error").innerHTML = "Too large";
                document.getElementById(propKey+"-error").style.color="red";
            }
            else {
                document.getElementById(propKey+"-error").innerHTML = "";
            }
        })
    }
    //console.log(propKey);
}

function generateShareLink() {
      const id = document.getElementById("link").dataset.val;
  const params = new URLSearchParams();
  const form = document.querySelector('form');

  const added = new Set(); // to avoid duplicating radio/checkbox names

  Array.from(form.elements).forEach(el => {
    if (!el.name) return;

    if ((el.type === 'radio' || el.type === 'checkbox')) {
      // Handle only once per name
      if (!added.has(el.name)) {
        added.add(el.name);
        const checked = form.querySelectorAll(`[name="${el.name}"]:checked`);
        checked.forEach(checkedEl => {
          params.append(checkedEl.name, checkedEl.value);
        });
      }
    } else if (el.value) {
      params.append(el.name, el.value);
    }
  });
      const shareURL = `${window.location.origin}/forms/${id}?${params.toString()}`;
      document.getElementById("share-link").innerHTML = `
      <a href="#" target="" onclick="copyToClipboard(this)" >${shareURL}</a>
    `;
    }

    function copyToClipboard(el) {
      const text = el.textContent;
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Copied to clipboard: ');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }

    const trash = document.querySelector("a.delete");
    trash.addEventListener('click',(e)=>{
        const endPoint = `/blogs/${trash.dataset.doc}`
        fetch(endPoint , {
            method : 'DELETE',
        })
        .then((result)=>result.json())
        .then(data=> window.location.href = data.redirect)
        .catch((err)=>{
            console.log(err);
        });
    });