window.jQuery = function(selectorOrArrayOrTemplate){
  let elements
  if(typeof selectorOrArrayOrTemplate === 'string'){
    if(selectorOrArrayOrTemplate[0] === '<'){
      // 创建 div
      elements=[createElement(selectorOrArrayOrTemplate)]
    }else{
      // 查找 div
      elements = document.querySelectorAll(selectorOrArrayOrTemplate)
    }
  }else if(selectorOrArrayOrTemplate instanceof Array){
    elements = selectorOrArrayOrTemplate
  }

  function createElement(string){
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }
  // api 可以操作elements
  const api = Object.create(jQuery.prototype)//创建一个对象，这个对象的__proto__为括号里面的东西，相当于const api = {__proto__:jQuery.prototype}
  Object.assign(api,{
    elements:elements,//不可以再写api={}要不会覆盖前面的api
    oldApi:selectorOrArrayOrTemplate.oldApi,
  })//把后面的属性一个一个复制到前面去
   // api.elements = elements//不可以再写api={}要不会覆盖前面的api
  // api.oldApi = oldApi
  return api
};//完成内存的节约

jQuery.fn = jQuery.prototype ={
  jquery:true,
  constructor:jQuery,
  get(index){
    return this.elements[index]
  },
  appendTo(node){
    if(node instanceof Element){
      this.each(el => node.appendChild(el)) // 遍历 elements，对每个 el 进行 node.appendChild 操作
    }else if(node.jquery === true){
      this.each(el => node.get(0).appendChild(el))  // 遍历 elements，对每个 el 进行 node.get(0).appendChild(el))  操作
    }
  },
  append(children){
    if(children instanceof Element){
      this.get(0).appendChild(children)
    }else if(children instanceof HTMLCollection){
      for(let i =0;i<children.length;i++){
        this.get(0).appendChild(children[i])
      }
    }else if(children.jquery === true){
      children.each(node => this.get(0).appendChild(node))
    }
  },
  find(selector){
    let array = []
    for(let i =0;i<this.elements.length;i++){
      const elements2 = Array.from(this.elements[i].querySelectorAll(selector))
      array = array.concat(this.elements2)
    }
    array.oldApi = this // this 就是 旧 api
    return jQuery(array)
  },
  each(fn){
    for(let i=0; i<this.elements.length;i++){
      fn.call(null,this.elements[i], i)//fn(elements[i],i)
    }
    return this
  },
  parent(){
    const array = []
    this.each((node)=>{
      if(array.indexOf(node.parentNode) === -1){
        array.push(node.parentNode)
      }
    })
    return jQuery(array)
  },
  children(){
    const array = []
    this.each((node)=>{
      // 上课的时候这段代码是复制的，复制错了，现已改正
      array.push(...node.children)//...把每个节点分开
      
    })
    //const newApi = jQuery(array)
    //return newApi
    return jQuery(array)
  },
  print(){
    console.log(this.elements)
  },
  // 闭包：函数访问外部的变量,访问函数只能使用函数访问
  addClass(className){
    for(let i=0;i<this.elements.length;i++){
      const element = this.elements[i]
      element.classList.add(className)
    }
    return this
  },
  end(){
    return this.oldApi  // this 就是新 api
  },
}
window.$ = window.jQuery
