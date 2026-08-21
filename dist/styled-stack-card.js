//#region node_modules/@lit/reactive-element/css-tag.js
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$2 = globalThis;
var e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s$2 = Symbol();
var o$3 = /* @__PURE__ */ new WeakMap();
var n$2 = class {
	constructor(t, e, o) {
		if (this._$cssResult$ = !0, o !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = t, this.t = e;
	}
	get styleSheet() {
		let t = this.o;
		const s = this.t;
		if (e$2 && void 0 === t) {
			const e = void 0 !== s && 1 === s.length;
			e && (t = o$3.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$3.set(s, t));
		}
		return t;
	}
	toString() {
		return this.cssText;
	}
};
var r$3 = (t) => new n$2("string" == typeof t ? t : t + "", void 0, s$2);
var i$3 = (t, ...e) => {
	return new n$2(1 === t.length ? t[0] : e.reduce((e, s, o) => e + ((t) => {
		if (!0 === t._$cssResult$) return t.cssText;
		if ("number" == typeof t) return t;
		throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
	})(s) + t[o + 1], t[0]), t, s$2);
};
var S$1 = (s, o) => {
	if (e$2) s.adoptedStyleSheets = o.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
	else for (const e of o) {
		const o = document.createElement("style"), n = t$2.litNonce;
		void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
	}
};
var c$2 = e$2 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
	let e = "";
	for (const s of t.cssRules) e += s.cssText;
	return r$3(e);
})(t) : t;
//#endregion
//#region node_modules/@lit/reactive-element/reactive-element.js
var _Symbol;
var _Symbol$metadata;
var _a$litPropertyMetadat;
var _a$reactiveElementVer;
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$2, getOwnPropertySymbols: o$2, getPrototypeOf: n$1 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t, s) => t, u$1 = {
	toAttribute(t, s) {
		switch (s) {
			case Boolean:
				t = t ? l$1 : null;
				break;
			case Object:
			case Array: t = null == t ? t : JSON.stringify(t);
		}
		return t;
	},
	fromAttribute(t, s) {
		let i = t;
		switch (s) {
			case Boolean:
				i = null !== t;
				break;
			case Number:
				i = null === t ? null : Number(t);
				break;
			case Object:
			case Array: try {
				i = JSON.parse(t);
			} catch (t) {
				i = null;
			}
		}
		return i;
	}
}, f$1 = (t, s) => !i$2(t, s), b$1 = {
	attribute: !0,
	type: String,
	converter: u$1,
	reflect: !1,
	useDefault: !1,
	hasChanged: f$1
};
(_Symbol$metadata = (_Symbol = Symbol).metadata) !== null && _Symbol$metadata !== void 0 || (_Symbol.metadata = Symbol("metadata")), (_a$litPropertyMetadat = a$1.litPropertyMetadata) !== null && _a$litPropertyMetadat !== void 0 || (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var y$1 = class extends HTMLElement {
	static addInitializer(t) {
		var _this$l;
		this._$Ei(), ((_this$l = this.l) !== null && _this$l !== void 0 ? _this$l : this.l = []).push(t);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(t, s = b$1) {
		if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
			const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
			void 0 !== h && e$1(this.prototype, t, h);
		}
	}
	static getPropertyDescriptor(t, s, i) {
		var _h;
		const { get: e, set: r } = (_h = h$1(this.prototype, t)) !== null && _h !== void 0 ? _h : {
			get() {
				return this[s];
			},
			set(t) {
				this[s] = t;
			}
		};
		return {
			get: e,
			set(s) {
				const h = e === null || e === void 0 ? void 0 : e.call(this);
				r === null || r === void 0 || r.call(this, s), this.requestUpdate(t, h, i);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(t) {
		var _this$elementProperti;
		return (_this$elementProperti = this.elementProperties.get(t)) !== null && _this$elementProperti !== void 0 ? _this$elementProperti : b$1;
	}
	static _$Ei() {
		if (this.hasOwnProperty(d$1("elementProperties"))) return;
		const t = n$1(this);
		t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(d$1("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
			const t = this.properties, s = [...r$2(t), ...o$2(t)];
			for (const i of s) this.createProperty(i, t[i]);
		}
		const t = this[Symbol.metadata];
		if (null !== t) {
			const s = litPropertyMetadata.get(t);
			if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (const [t, s] of this.elementProperties) {
			const i = this._$Eu(t, s);
			void 0 !== i && this._$Eh.set(i, t);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(s) {
		const i = [];
		if (Array.isArray(s)) {
			const e = new Set(s.flat(Infinity).reverse());
			for (const s of e) i.unshift(c$2(s));
		} else void 0 !== s && i.push(c$2(s));
		return i;
	}
	static _$Eu(t, s) {
		const i = s.attribute;
		return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		var _this$constructor$l;
		this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_this$constructor$l = this.constructor.l) === null || _this$constructor$l === void 0 || _this$constructor$l.forEach((t) => t(this));
	}
	addController(t) {
		var _this$_$EO, _t$hostConnected;
		((_this$_$EO = this._$EO) !== null && _this$_$EO !== void 0 ? _this$_$EO : this._$EO = /* @__PURE__ */ new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && ((_t$hostConnected = t.hostConnected) === null || _t$hostConnected === void 0 || _t$hostConnected.call(t));
	}
	removeController(t) {
		var _this$_$EO2;
		(_this$_$EO2 = this._$EO) === null || _this$_$EO2 === void 0 || _this$_$EO2.delete(t);
	}
	_$E_() {
		const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
		for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
		t.size > 0 && (this._$Ep = t);
	}
	createRenderRoot() {
		var _this$shadowRoot;
		const t = (_this$shadowRoot = this.shadowRoot) !== null && _this$shadowRoot !== void 0 ? _this$shadowRoot : this.attachShadow(this.constructor.shadowRootOptions);
		return S$1(t, this.constructor.elementStyles), t;
	}
	connectedCallback() {
		var _this$renderRoot, _this$_$EO3;
		(_this$renderRoot = this.renderRoot) !== null && _this$renderRoot !== void 0 || (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (_this$_$EO3 = this._$EO) === null || _this$_$EO3 === void 0 || _this$_$EO3.forEach((t) => {
			var _t$hostConnected2;
			return (_t$hostConnected2 = t.hostConnected) === null || _t$hostConnected2 === void 0 ? void 0 : _t$hostConnected2.call(t);
		});
	}
	enableUpdating(t) {}
	disconnectedCallback() {
		var _this$_$EO4;
		(_this$_$EO4 = this._$EO) === null || _this$_$EO4 === void 0 || _this$_$EO4.forEach((t) => {
			var _t$hostDisconnected;
			return (_t$hostDisconnected = t.hostDisconnected) === null || _t$hostDisconnected === void 0 ? void 0 : _t$hostDisconnected.call(t);
		});
	}
	attributeChangedCallback(t, s, i) {
		this._$AK(t, i);
	}
	_$ET(t, s) {
		const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
		if (void 0 !== e && !0 === i.reflect) {
			var _i$converter;
			const h = (void 0 !== ((_i$converter = i.converter) === null || _i$converter === void 0 ? void 0 : _i$converter.toAttribute) ? i.converter : u$1).toAttribute(s, i.type);
			this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
		}
	}
	_$AK(t, s) {
		const i = this.constructor, e = i._$Eh.get(t);
		if (void 0 !== e && this._$Em !== e) {
			var _t$converter, _ref, _this$_$Ej;
			const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== ((_t$converter = t.converter) === null || _t$converter === void 0 ? void 0 : _t$converter.fromAttribute) ? t.converter : u$1;
			this._$Em = e;
			const r = h.fromAttribute(s, t.type);
			this[e] = (_ref = r !== null && r !== void 0 ? r : (_this$_$Ej = this._$Ej) === null || _this$_$Ej === void 0 ? void 0 : _this$_$Ej.get(e)) !== null && _ref !== void 0 ? _ref : r, this._$Em = null;
		}
	}
	requestUpdate(t, s, i, e = !1, h) {
		if (void 0 !== t) {
			var _i, _i$hasChanged, _this$_$Ej2;
			const r = this.constructor;
			if (!1 === e && (h = this[t]), (_i = i) !== null && _i !== void 0 || (i = r.getPropertyOptions(t)), !(((_i$hasChanged = i.hasChanged) !== null && _i$hasChanged !== void 0 ? _i$hasChanged : f$1)(h, s) || i.useDefault && i.reflect && h === ((_this$_$Ej2 = this._$Ej) === null || _this$_$Ej2 === void 0 ? void 0 : _this$_$Ej2.get(t)) && !this.hasAttribute(r._$Eu(t, i)))) return;
			this.C(t, s, i);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
		var _this$_$Ej3, _ref2, _this$_$Eq;
		i && !((_this$_$Ej3 = this._$Ej) !== null && _this$_$Ej3 !== void 0 ? _this$_$Ej3 : this._$Ej = /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, (_ref2 = r !== null && r !== void 0 ? r : s) !== null && _ref2 !== void 0 ? _ref2 : this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && ((_this$_$Eq = this._$Eq) !== null && _this$_$Eq !== void 0 ? _this$_$Eq : this._$Eq = /* @__PURE__ */ new Set()).add(t));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (t) {
			Promise.reject(t);
		}
		const t = this.scheduleUpdate();
		return null != t && await t, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			var _this$renderRoot2;
			if ((_this$renderRoot2 = this.renderRoot) !== null && _this$renderRoot2 !== void 0 || (this.renderRoot = this.createRenderRoot()), this._$Ep) {
				for (const [t, s] of this._$Ep) this[t] = s;
				this._$Ep = void 0;
			}
			const t = this.constructor.elementProperties;
			if (t.size > 0) for (const [s, i] of t) {
				const { wrapped: t } = i, e = this[s];
				!0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
			}
		}
		let t = !1;
		const s = this._$AL;
		try {
			var _this$_$EO5;
			t = this.shouldUpdate(s), t ? (this.willUpdate(s), (_this$_$EO5 = this._$EO) === null || _this$_$EO5 === void 0 || _this$_$EO5.forEach((t) => {
				var _t$hostUpdate;
				return (_t$hostUpdate = t.hostUpdate) === null || _t$hostUpdate === void 0 ? void 0 : _t$hostUpdate.call(t);
			}), this.update(s)) : this._$EM();
		} catch (s) {
			throw t = !1, this._$EM(), s;
		}
		t && this._$AE(s);
	}
	willUpdate(t) {}
	_$AE(t) {
		var _this$_$EO6;
		(_this$_$EO6 = this._$EO) === null || _this$_$EO6 === void 0 || _this$_$EO6.forEach((t) => {
			var _t$hostUpdated;
			return (_t$hostUpdated = t.hostUpdated) === null || _t$hostUpdated === void 0 ? void 0 : _t$hostUpdated.call(t);
		}), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(t) {
		return !0;
	}
	update(t) {
		this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
	}
	updated(t) {}
	firstUpdated(t) {}
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 === null || p$1 === void 0 || p$1({ ReactiveElement: y$1 }), ((_a$reactiveElementVer = a$1.reactiveElementVersions) !== null && _a$reactiveElementVer !== void 0 ? _a$reactiveElementVer : a$1.reactiveElementVersions = []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var _t$litHtmlVersions;
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$1 = globalThis;
var i$1 = (t) => t;
var s$1 = t$1.trustedTypes;
var e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t) => t }) : void 0;
var h = "$lit$";
var o$1 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n = "?" + o$1;
var r$1 = `<${n}>`;
var l = document;
var c = () => l.createComment("");
var a = (t) => null === t || "object" != typeof t && "function" != typeof t;
var u = Array.isArray;
var d = (t) => u(t) || "function" == typeof (t === null || t === void 0 ? void 0 : t[Symbol.iterator]);
var f = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y = /^(?:script|style|textarea|title)$/i;
var x = (t) => (i, ...s) => ({
	_$litType$: t,
	strings: i,
	values: s
});
var b = x(1);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l.createTreeWalker(l, 129);
function V(t, i) {
	if (!u(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return void 0 !== e ? e.createHTML(i) : i;
}
var N = (t, i) => {
	const s = t.length - 1, e = [];
	let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = v;
	for (let i = 0; i < s; i++) {
		var _n;
		const s = t[i];
		let a, u, d = -1, f = 0;
		for (; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);) f = c.lastIndex, c === v ? "!--" === u[1] ? c = _ : void 0 !== u[1] ? c = m : void 0 !== u[2] ? (y.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = p) : void 0 !== u[3] && (c = p) : c === p ? ">" === u[0] ? (c = (_n = n) !== null && _n !== void 0 ? _n : v, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? p : "\"" === u[3] ? $ : g) : c === $ || c === g ? c = p : c === _ || c === m ? c = v : (c = p, n = void 0);
		const x = c === p && t[i + 1].startsWith("/>") ? " " : "";
		l += c === v ? s + r$1 : d >= 0 ? (e.push(a), s.slice(0, d) + h + s.slice(d) + o$1 + x) : s + o$1 + (-2 === d ? i : x);
	}
	return [V(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), e];
};
var S = class S {
	constructor({ strings: t, _$litType$: i }, e) {
		let r;
		this.parts = [];
		let l = 0, a = 0;
		const u = t.length - 1, d = this.parts, [f, v] = N(t, i);
		if (this.el = S.createElement(f, e), P.currentNode = this.el.content, 2 === i || 3 === i) {
			const t = this.el.content.firstChild;
			t.replaceWith(...t.childNodes);
		}
		for (; null !== (r = P.nextNode()) && d.length < u;) {
			if (1 === r.nodeType) {
				if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(h)) {
					const i = v[a++], s = r.getAttribute(t).split(o$1), e = /([.?@])?(.*)/.exec(i);
					d.push({
						type: 1,
						index: l,
						name: e[2],
						strings: s,
						ctor: "." === e[1] ? I : "?" === e[1] ? L : "@" === e[1] ? z : H
					}), r.removeAttribute(t);
				} else t.startsWith(o$1) && (d.push({
					type: 6,
					index: l
				}), r.removeAttribute(t));
				if (y.test(r.tagName)) {
					const t = r.textContent.split(o$1), i = t.length - 1;
					if (i > 0) {
						r.textContent = s$1 ? s$1.emptyScript : "";
						for (let s = 0; s < i; s++) r.append(t[s], c()), P.nextNode(), d.push({
							type: 2,
							index: ++l
						});
						r.append(t[i], c());
					}
				}
			} else if (8 === r.nodeType) if (r.data === n) d.push({
				type: 2,
				index: l
			});
			else {
				let t = -1;
				for (; -1 !== (t = r.data.indexOf(o$1, t + 1));) d.push({
					type: 7,
					index: l
				}), t += o$1.length - 1;
			}
			l++;
		}
	}
	static createElement(t, i) {
		const s = l.createElement("template");
		return s.innerHTML = t, s;
	}
};
function M(t, i, s = t, e) {
	var _s$_$Co, _h$_$AO, _s$_$Co2;
	if (i === E) return i;
	let h = void 0 !== e ? (_s$_$Co = s._$Co) === null || _s$_$Co === void 0 ? void 0 : _s$_$Co[e] : s._$Cl;
	const o = a(i) ? void 0 : i._$litDirective$;
	return (h === null || h === void 0 ? void 0 : h.constructor) !== o && (h === null || h === void 0 || (_h$_$AO = h._$AO) === null || _h$_$AO === void 0 || _h$_$AO.call(h, !1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? ((_s$_$Co2 = s._$Co) !== null && _s$_$Co2 !== void 0 ? _s$_$Co2 : s._$Co = [])[e] = h : s._$Cl = h), void 0 !== h && (i = M(t, h._$AS(t, i.values), h, e)), i;
}
var R = class {
	constructor(t, i) {
		this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(t) {
		var _t$creationScope;
		const { el: { content: i }, parts: s } = this._$AD, e = ((_t$creationScope = t === null || t === void 0 ? void 0 : t.creationScope) !== null && _t$creationScope !== void 0 ? _t$creationScope : l).importNode(i, !0);
		P.currentNode = e;
		let h = P.nextNode(), o = 0, n = 0, r = s[0];
		for (; void 0 !== r;) {
			if (o === r.index) {
				let i;
				2 === r.type ? i = new k(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new Z(h, this, t)), this._$AV.push(i), r = s[++n];
			}
			o !== (r === null || r === void 0 ? void 0 : r.index) && (h = P.nextNode(), o++);
		}
		return P.currentNode = l, e;
	}
	p(t) {
		let i = 0;
		for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
	}
};
var k = class k {
	get _$AU() {
		var _this$_$AM$_$AU, _this$_$AM;
		return (_this$_$AM$_$AU = (_this$_$AM = this._$AM) === null || _this$_$AM === void 0 ? void 0 : _this$_$AM._$AU) !== null && _this$_$AM$_$AU !== void 0 ? _this$_$AM$_$AU : this._$Cv;
	}
	constructor(t, i, s, e) {
		var _e$isConnected;
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = (_e$isConnected = e === null || e === void 0 ? void 0 : e.isConnected) !== null && _e$isConnected !== void 0 ? _e$isConnected : !0;
	}
	get parentNode() {
		let t = this._$AA.parentNode;
		const i = this._$AM;
		return void 0 !== i && 11 === (t === null || t === void 0 ? void 0 : t.nodeType) && (t = i.parentNode), t;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(t, i = this) {
		t = M(this, t, i), a(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== E && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : d(t) ? this.k(t) : this._(t);
	}
	O(t) {
		return this._$AA.parentNode.insertBefore(t, this._$AB);
	}
	T(t) {
		this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
	}
	_(t) {
		this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t : this.T(l.createTextNode(t)), this._$AH = t;
	}
	$(t) {
		var _this$_$AH;
		const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = S.createElement(V(s.h, s.h[0]), this.options)), s);
		if (((_this$_$AH = this._$AH) === null || _this$_$AH === void 0 ? void 0 : _this$_$AH._$AD) === e) this._$AH.p(i);
		else {
			const t = new R(e, this), s = t.u(this.options);
			t.p(i), this.T(s), this._$AH = t;
		}
	}
	_$AC(t) {
		let i = C.get(t.strings);
		return void 0 === i && C.set(t.strings, i = new S(t)), i;
	}
	k(t) {
		u(this._$AH) || (this._$AH = [], this._$AR());
		const i = this._$AH;
		let s, e = 0;
		for (const h of t) e === i.length ? i.push(s = new k(this.O(c()), this.O(c()), this, this.options)) : s = i[e], s._$AI(h), e++;
		e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
	}
	_$AR(t = this._$AA.nextSibling, s) {
		var _this$_$AP;
		for ((_this$_$AP = this._$AP) === null || _this$_$AP === void 0 || _this$_$AP.call(this, !1, !0, s); t !== this._$AB;) {
			const s = i$1(t).nextSibling;
			i$1(t).remove(), t = s;
		}
	}
	setConnected(t) {
		var _this$_$AP2;
		void 0 === this._$AM && (this._$Cv = t, (_this$_$AP2 = this._$AP) === null || _this$_$AP2 === void 0 || _this$_$AP2.call(this, t));
	}
};
var H = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(t, i, s, e, h) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = A;
	}
	_$AI(t, i = this, s, e) {
		const h = this.strings;
		let o = !1;
		if (void 0 === h) t = M(this, t, i, 0), o = !a(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
		else {
			var _r;
			const e = t;
			let n, r;
			for (t = h[0], n = 0; n < h.length - 1; n++) r = M(this, e[s + n], i, n), r === E && (r = this._$AH[n]), o || (o = !a(r) || r !== this._$AH[n]), r === A ? t = A : t !== A && (t += ((_r = r) !== null && _r !== void 0 ? _r : "") + h[n + 1]), this._$AH[n] = r;
		}
		o && !e && this.j(t);
	}
	j(t) {
		t === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t !== null && t !== void 0 ? t : "");
	}
};
var I = class extends H {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(t) {
		this.element[this.name] = t === A ? void 0 : t;
	}
};
var L = class extends H {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(t) {
		this.element.toggleAttribute(this.name, !!t && t !== A);
	}
};
var z = class extends H {
	constructor(t, i, s, e, h) {
		super(t, i, s, e, h), this.type = 5;
	}
	_$AI(t, i = this) {
		var _M;
		if ((t = (_M = M(this, t, i, 0)) !== null && _M !== void 0 ? _M : A) === E) return;
		const s = this._$AH, e = t === A && s !== A || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== A && (s === A || e);
		e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
	}
	handleEvent(t) {
		var _this$options$host, _this$options;
		"function" == typeof this._$AH ? this._$AH.call((_this$options$host = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.host) !== null && _this$options$host !== void 0 ? _this$options$host : this.element, t) : this._$AH.handleEvent(t);
	}
};
var Z = class {
	constructor(t, i, s) {
		this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(t) {
		M(this, t);
	}
};
var B = t$1.litHtmlPolyfillSupport;
B === null || B === void 0 || B(S, k), ((_t$litHtmlVersions = t$1.litHtmlVersions) !== null && _t$litHtmlVersions !== void 0 ? _t$litHtmlVersions : t$1.litHtmlVersions = []).push("3.3.3");
var D = (t, i, s) => {
	var _s$renderBefore;
	const e = (_s$renderBefore = s === null || s === void 0 ? void 0 : s.renderBefore) !== null && _s$renderBefore !== void 0 ? _s$renderBefore : i;
	let h = e._$litPart$;
	if (void 0 === h) {
		var _s$renderBefore2;
		const t = (_s$renderBefore2 = s === null || s === void 0 ? void 0 : s.renderBefore) !== null && _s$renderBefore2 !== void 0 ? _s$renderBefore2 : null;
		e._$litPart$ = h = new k(i.insertBefore(c(), t), t, void 0, s !== null && s !== void 0 ? s : {});
	}
	return h._$AI(t), h;
};
//#endregion
//#region node_modules/lit-element/lit-element.js
var _s$litElementHydrateS;
var _s$litElementVersions;
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var s = globalThis;
var i = class extends y$1 {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		var _this$renderOptions, _this$renderOptions$r;
		const t = super.createRenderRoot();
		return (_this$renderOptions$r = (_this$renderOptions = this.renderOptions).renderBefore) !== null && _this$renderOptions$r !== void 0 || (_this$renderOptions.renderBefore = t.firstChild), t;
	}
	update(t) {
		const r = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = D(r, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		var _this$_$Do;
		super.connectedCallback(), (_this$_$Do = this._$Do) === null || _this$_$Do === void 0 || _this$_$Do.setConnected(!0);
	}
	disconnectedCallback() {
		var _this$_$Do2;
		super.disconnectedCallback(), (_this$_$Do2 = this._$Do) === null || _this$_$Do2 === void 0 || _this$_$Do2.setConnected(!1);
	}
	render() {
		return E;
	}
};
i._$litElement$ = !0, i["finalized"] = !0, (_s$litElementHydrateS = s.litElementHydrateSupport) === null || _s$litElementHydrateS === void 0 || _s$litElementHydrateS.call(s, { LitElement: i });
var o = s.litElementPolyfillSupport;
o === null || o === void 0 || o({ LitElement: i });
((_s$litElementVersions = s.litElementVersions) !== null && _s$litElementVersions !== void 0 ? _s$litElementVersions : s.litElementVersions = []).push("4.2.2");
//#endregion
//#region src/styled-stack-card.ts
var StyledStackCard = class StyledStackCard extends i {
	static get properties() {
		return {
			hass: { attribute: false },
			config: { state: true },
			_cards: { state: true }
		};
	}
	constructor() {
		super();
		this._cards = [];
	}
	static async getConfigElement() {
		await StyledStackCard.ensureHaEditorElements();
		return document.createElement("styled-stack-card-editor");
	}
	/** Carga hui-card-picker y hui-card-element-editor vía el editor nativo del vertical-stack. */
	static async ensureHaEditorElements() {
		if (customElements.get("hui-card-picker")) return;
		const cardClass = (await window.loadCardHelpers()).createCardElement({ type: "vertical-stack" }).constructor;
		if (cardClass.getConfigElement) await cardClass.getConfigElement();
		await customElements.whenDefined("hui-card-picker");
		await customElements.whenDefined("hui-card-element-editor");
	}
	set hass(hass) {
		this._hass = hass;
		if (this._cards) this._cards.forEach((card) => {
			card.hass = hass;
		});
	}
	get hass() {
		return this._hass;
	}
	async setConfig(config) {
		this.config = config;
		if (config.cards && Array.isArray(config.cards)) await this._createCards();
		else this._cards = [];
	}
	async _createCards() {
		const helpers = await window.loadCardHelpers();
		this._cards = await Promise.all(this.config.cards.map(async (cardConfig) => {
			const element = helpers.createCardElement(cardConfig);
			if (this._hass) element.hass = this._hass;
			return element;
		}));
	}
	getGradientStyle() {
		var _this$config;
		const style = ((_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.style_config) || {};
		if (style.preset === "spotify") return `linear-gradient(135deg, rgba(17, 255, 0, 0.60) 0%, rgba(22, 119, 9, 0.60) 50%, rgba(0, 0, 0, 0.60) 100%)`;
		if (style.preset === "lights") return `linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 0, 0.65) 50%, rgba(191, 99, 13, 0.65) 100%)`;
		if (style.preset === "water") return `linear-gradient(135deg, rgba(0, 170, 255, 0.60) 0%, rgba(0, 119, 179, 0.80) 50%, rgba(255, 255, 255, 0.37) 100%)`;
		if (style.preset === "alert") return `linear-gradient(135deg, rgba(255, 0, 0, 0.60) 0%, rgba(119, 9, 9, 0.60) 50%, rgba(46, 0, 0, 0.60) 100%)`;
		const start = style.color_start || "transparent";
		const end = style.color_end || "transparent";
		const angle = style.angle || 135;
		if (style.color_mid) {
			var _style$color_mid_pos;
			const midPos = (_style$color_mid_pos = style.color_mid_pos) !== null && _style$color_mid_pos !== void 0 ? _style$color_mid_pos : 50;
			return `linear-gradient(${angle}deg, ${start} 0%, ${style.color_mid} ${midPos}%, ${end} 100%)`;
		}
		return `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`;
	}
	static getStubConfig() {
		return {
			style_config: { preset: "spotify" },
			cards: []
		};
	}
	render() {
		if (!this.config) return b``;
		if (!this._cards || this._cards.length === 0) return b`
        <ha-card style="background: ${this.getGradientStyle()};">
          <div class="card-content" style="padding: 16px; text-align: center;">
            <p>⚙️ <b>Styled Stack Card:</b> Añade tarjetas en el código YAML o configura las opciones.</p>
          </div>
        </ha-card>
      `;
		return b`
      <ha-card style="background: ${this.getGradientStyle()}; border: none;">
        <div class="card-content">
          ${this._cards}
        </div>
      </ha-card>
    `;
	}
	static get styles() {
		return i$3`
      :host {
        display: block;
      }
      ha-card {
        overflow: hidden;
        transition: all 0.3s ease-out;
      }
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0;
        --ha-card-background: none !important;
        --card-background-color: transparent !important;
      }
    `;
	}
};
//#endregion
//#region node_modules/custom-card-helpers/dist/index.m.js
var t;
var r;
(function(e) {
	e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(t || (t = {})), function(e) {
	e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(r || (r = {}));
var ke = function() {
	var e = document.querySelector("home-assistant");
	if (e = (e = (e = (e = (e = (e = (e = (e = e && e.shadowRoot) && e.querySelector("home-assistant-main")) && e.shadowRoot) && e.querySelector("app-drawer-layout partial-panel-resolver")) && e.shadowRoot || e) && e.querySelector("ha-panel-lovelace")) && e.shadowRoot) && e.querySelector("hui-root")) {
		var t = e.lovelace;
		return t.current_view = e.___curView, t;
	}
	return null;
};
//#endregion
//#region src/styled-stack-card-editor.ts
var CLIPBOARD_KEY = "dashboardCardClipboard";
var mdiContentCopy = "M19,21H8V7H19M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z";
var mdiContentCut = "M19,3H14.82C14.4,1.84 13.3,1 12,1A3,3 0 0,0 9,3H4A2,2 0 0,0 2,5V19A2,2 0 0,0 4,21H9A3,3 0 0,0 12,23A3,3 0 0,0 15,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z";
var mdiContentPaste = "M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z";
var mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
var mdiPlus = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
var mdiChevronLeft = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z";
var mdiChevronRight = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z";
var PRESET_OPTIONS = [
	{
		value: "custom",
		label: "Colores manuales"
	},
	{
		value: "spotify",
		label: "Spotify"
	},
	{
		value: "lights",
		label: "Luces"
	},
	{
		value: "water",
		label: "Agua / Baño"
	},
	{
		value: "alert",
		label: "Alerta"
	}
];
var StyledStackCardEditor = class extends i {
	constructor(..._args) {
		super(..._args);
		this._selectedCard = 0;
		this._computePresetLabel = (schema) => schema.name === "preset" ? "Tema visual" : schema.name;
		this._computeAngleLabel = (schema) => schema.name === "angle" ? "Ángulo del degradado" : schema.name;
	}
	static get properties() {
		return {
			hass: { attribute: false },
			lovelace: { attribute: false },
			_config: { state: true },
			_selectedCard: { state: true }
		};
	}
	set hass(hass) {
		this._hass = hass;
	}
	set lovelace(lovelace) {
		this._lovelace = lovelace;
	}
	get _effectiveLovelace() {
		var _this$_lovelace;
		return (_this$_lovelace = this._lovelace) !== null && _this$_lovelace !== void 0 ? _this$_lovelace : ke();
	}
	setConfig(config) {
		var _this$_config$cards$l, _this$_config$cards;
		this._config = config !== null && config !== void 0 ? config : {
			type: "styled-stack-card",
			cards: []
		};
		const numCards = (_this$_config$cards$l = (_this$_config$cards = this._config.cards) === null || _this$_config$cards === void 0 ? void 0 : _this$_config$cards.length) !== null && _this$_config$cards$l !== void 0 ? _this$_config$cards$l : 0;
		if (this._selectedCard > numCards) this._selectedCard = numCards;
	}
	async firstUpdated() {
		if (StyledStackCard && StyledStackCard.ensureHaEditorElements) await StyledStackCard.ensureHaEditorElements();
	}
	_updateConfig(newConfig) {
		this._config = newConfig;
		this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: newConfig },
			bubbles: true,
			composed: true
		}));
	}
	_parseRgbaString(value) {
		const match = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
		if (match) {
			const r = parseInt(match[1], 10);
			const g = parseInt(match[2], 10);
			const b = parseInt(match[3], 10);
			const a = match[4] !== void 0 ? parseFloat(match[4]) : 1;
			return {
				rgb: [
					r,
					g,
					b
				],
				alpha: Math.round(a * 100)
			};
		}
		return {
			rgb: [
				128,
				128,
				128
			],
			alpha: 100
		};
	}
	_rgbToRgbaString(rgb, alpha) {
		const a = (alpha / 100).toFixed(2);
		return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
	}
	_getStyleData() {
		var _style$color_mid_pos, _style$angle;
		const style = this._config.style_config || {};
		const startParsed = this._parseRgbaString(style.color_start || "rgba(128,128,128,0.25)");
		const endParsed = this._parseRgbaString(style.color_end || "rgba(30,30,30,0)");
		const hasMid = style.color_mid !== void 0 && style.color_mid !== null;
		const midParsed = hasMid ? this._parseRgbaString(style.color_mid) : {
			rgb: [
				128,
				128,
				128
			],
			alpha: 50
		};
		return {
			preset: style.preset || "custom",
			color_start_rgb: startParsed.rgb,
			color_start_alpha: startParsed.alpha,
			color_end_rgb: endParsed.rgb,
			color_end_alpha: endParsed.alpha,
			has_mid: hasMid,
			color_mid_rgb: midParsed.rgb,
			color_mid_alpha: midParsed.alpha,
			color_mid_pos: (_style$color_mid_pos = style.color_mid_pos) !== null && _style$color_mid_pos !== void 0 ? _style$color_mid_pos : 50,
			angle: Number((_style$angle = style.angle) !== null && _style$angle !== void 0 ? _style$angle : 135)
		};
	}
	_presetSchema() {
		return [{
			name: "preset",
			selector: { select: {
				mode: "dropdown",
				options: PRESET_OPTIONS
			} }
		}];
	}
	_angleSchema() {
		return [{
			name: "angle",
			selector: { number: {
				min: 0,
				max: 360,
				step: 1,
				unit_of_measurement: "°"
			} }
		}];
	}
	_handlePresetChanged(ev) {
		ev.stopPropagation();
		const newPreset = ev.detail.value.preset;
		const current = this._config.style_config || {};
		this._updateConfig({
			...this._config,
			style_config: {
				...current,
				preset: newPreset
			}
		});
	}
	_handleAngleChanged(ev) {
		ev.stopPropagation();
		const newAngle = ev.detail.value.angle;
		const current = this._config.style_config || {};
		this._updateConfig({
			...this._config,
			style_config: {
				...current,
				angle: newAngle
			}
		});
	}
	_handleColorChange(field, rgb, alpha) {
		const current = this._config.style_config || {};
		this._updateConfig({
			...this._config,
			style_config: {
				...current,
				[field]: this._rgbToRgbaString(rgb, alpha)
			}
		});
	}
	_handleColorRgbChanged(ev, field) {
		ev.stopPropagation();
		const data = this._getStyleData();
		const newRgb = ev.detail.value;
		const alpha = field === "color_start" ? data.color_start_alpha : field === "color_mid" ? data.color_mid_alpha : data.color_end_alpha;
		this._handleColorChange(field, newRgb, alpha);
	}
	_handleAlphaChanged(ev, field) {
		const input = ev.target;
		const alpha = parseInt(input.value, 10);
		const data = this._getStyleData();
		const rgb = field === "color_start" ? data.color_start_rgb : field === "color_mid" ? data.color_mid_rgb : data.color_end_rgb;
		this._handleColorChange(field, rgb, alpha);
	}
	_handleMidPosChanged(ev) {
		const input = ev.target;
		const pos = parseInt(input.value, 10);
		const current = this._config.style_config || {};
		this._updateConfig({
			...this._config,
			style_config: {
				...current,
				color_mid_pos: pos
			}
		});
	}
	_toggleMidColor() {
		const current = this._config.style_config || {};
		if (current.color_mid !== void 0) {
			const { color_mid, color_mid_pos, ...rest } = current;
			this._updateConfig({
				...this._config,
				style_config: rest
			});
		} else this._updateConfig({
			...this._config,
			style_config: {
				...current,
				color_mid: "rgba(128, 128, 128, 0.15)",
				color_mid_pos: 50
			}
		});
	}
	_renderColorRow(label, field, rgb, alpha, opts) {
		const solidColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
		const previewColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${(alpha / 100).toFixed(2)})`;
		const alphaTrack = `linear-gradient(to right, transparent, ${solidColor})`;
		return b`
      <div class="color-row">
        <div class="color-row-header">
          <span class="color-row-label">${label}</span>
          <div class="color-row-header-right">
            ${(opts === null || opts === void 0 ? void 0 : opts.removable) ? b`
              <button class="btn-remove-mid" @click=${this._toggleMidColor} title="Eliminar color medio">
                ✕
              </button>
            ` : A}
            <div class="color-swatch-wrap">
              <div class="checker-bg"></div>
              <div class="color-swatch" style="background:${previewColor}"></div>
            </div>
          </div>
        </div>
        <div class="color-row-body">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ color_rgb: {} }}
            .value=${rgb}
            @value-changed=${(e) => this._handleColorRgbChanged(e, field)}
          ></ha-selector>
          <div class="alpha-row">
            <span class="alpha-label">Opacidad</span>
            <div class="alpha-slider-wrap">
              <div class="alpha-track" style="--alpha-gradient:${alphaTrack}"></div>
              <input
                type="range"
                class="alpha-slider"
                min="0"
                max="100"
                step="1"
                .value=${String(alpha)}
                @input=${(e) => this._handleAlphaChanged(e, field)}
                @change=${(e) => this._handleAlphaChanged(e, field)}
              />
            </div>
            <span class="alpha-value">${alpha}%</span>
          </div>
          ${(opts === null || opts === void 0 ? void 0 : opts.midPos) !== void 0 ? b`
            <div class="alpha-row">
              <span class="alpha-label">Posición</span>
              <div class="alpha-slider-wrap">
                <div class="alpha-track" style="--alpha-gradient:linear-gradient(to right, var(--divider-color), var(--primary-color))"></div>
                <input
                  type="range"
                  class="alpha-slider"
                  min="1"
                  max="99"
                  step="1"
                  .value=${String(opts.midPos)}
                  @input=${this._handleMidPosChanged}
                  @change=${this._handleMidPosChanged}
                />
              </div>
              <span class="alpha-value">${opts.midPos}%</span>
            </div>
          ` : A}
        </div>
      </div>
    `;
	}
	_handleSelectedCard(ev) {
		this._selectedCard = parseInt(ev.detail.name, 10);
	}
	_handleCardPicked(ev) {
		var _ev$detail;
		ev.stopPropagation();
		const newCardConfig = (_ev$detail = ev.detail) === null || _ev$detail === void 0 ? void 0 : _ev$detail.config;
		if (!newCardConfig) return;
		const cards = [...this._config.cards || [], newCardConfig];
		this._updateConfig({
			...this._config,
			cards
		});
		this._selectedCard = cards.length - 1;
	}
	_handleCardConfigChanged(ev) {
		ev.stopPropagation();
		if (!this._config.cards) return;
		const cards = [...this._config.cards];
		cards[this._selectedCard] = ev.detail.config;
		this._updateConfig({
			...this._config,
			cards
		});
	}
	_getClipboardCard() {
		try {
			const data = sessionStorage.getItem(CLIPBOARD_KEY);
			return data ? JSON.parse(data) : null;
		} catch (_unused) {
			return null;
		}
	}
	_copyCardToClipboard(card) {
		var _this$_hass$localize, _this$_hass, _this$_hass$localize2;
		sessionStorage.setItem(CLIPBOARD_KEY, JSON.stringify(card));
		this._showToast((_this$_hass$localize = (_this$_hass = this._hass) === null || _this$_hass === void 0 || (_this$_hass$localize2 = _this$_hass.localize) === null || _this$_hass$localize2 === void 0 ? void 0 : _this$_hass$localize2.call(_this$_hass, "ui.common.copied")) !== null && _this$_hass$localize !== void 0 ? _this$_hass$localize : "Copiado");
		this.requestUpdate();
	}
	_handlePasteCard() {
		var _this$_hass$localize3, _this$_hass2, _this$_hass2$localize;
		const clipboardCard = this._getClipboardCard();
		if (!clipboardCard) return;
		const cards = [...this._config.cards || [], clipboardCard];
		this._updateConfig({
			...this._config,
			cards
		});
		this._selectedCard = cards.length - 1;
		this._showToast((_this$_hass$localize3 = (_this$_hass2 = this._hass) === null || _this$_hass2 === void 0 || (_this$_hass2$localize = _this$_hass2.localize) === null || _this$_hass2$localize === void 0 ? void 0 : _this$_hass2$localize.call(_this$_hass2, "ui.common.pasted")) !== null && _this$_hass$localize3 !== void 0 ? _this$_hass$localize3 : "Pegado");
	}
	_showToast(message) {
		this.dispatchEvent(new CustomEvent("hass-notification", {
			detail: { message },
			bubbles: true,
			composed: true
		}));
	}
	_handleCopyCard() {
		var _this$_config$cards2;
		if (!((_this$_config$cards2 = this._config.cards) === null || _this$_config$cards2 === void 0 ? void 0 : _this$_config$cards2[this._selectedCard])) return;
		this._copyCardToClipboard(JSON.parse(JSON.stringify(this._config.cards[this._selectedCard])));
	}
	_handleCutCard() {
		if (!this._config.cards) return;
		this._handleCopyCard();
		this._handleDeleteCard();
	}
	_handleDeleteCard() {
		if (!this._config.cards) return;
		const cards = [...this._config.cards];
		cards.splice(this._selectedCard, 1);
		this._updateConfig({
			...this._config,
			cards
		});
		this._selectedCard = Math.max(0, this._selectedCard - 1);
	}
	_handleMove(direction) {
		if (!this._config.cards) return;
		const target = this._selectedCard + direction;
		if (target < 0 || target >= this._config.cards.length) return;
		const cards = [...this._config.cards];
		const [card] = cards.splice(this._selectedCard, 1);
		cards.splice(target, 0, card);
		this._updateConfig({
			...this._config,
			cards
		});
		this._selectedCard = target;
	}
	render() {
		var _this$_hass$localize4, _this$_hass$localize5, _this$_hass3, _this$_hass$localize6, _this$_hass$localize7, _this$_hass4, _this$_hass$localize8, _this$_hass$localize9, _this$_hass5;
		if (!this._config || !this._hass) return A;
		const data = this._getStyleData();
		const preset = data.preset;
		const cards = this._config.cards || [];
		const selected = this._selectedCard;
		const numCards = cards.length;
		const isAdding = selected >= numCards;
		const hasClipboard = this._getClipboardCard() !== null;
		const gradientPreview = preset === "custom" ? data.has_mid ? `linear-gradient(${data.angle}deg, ${this._rgbToRgbaString(data.color_start_rgb, data.color_start_alpha)} 0%, ${this._rgbToRgbaString(data.color_mid_rgb, data.color_mid_alpha)} ${data.color_mid_pos}%, ${this._rgbToRgbaString(data.color_end_rgb, data.color_end_alpha)} 100%)` : `linear-gradient(${data.angle}deg, ${this._rgbToRgbaString(data.color_start_rgb, data.color_start_alpha)} 0%, ${this._rgbToRgbaString(data.color_end_rgb, data.color_end_alpha)} 100%)` : "";
		return b`
      <div class="card-config">

        <!-- SELECTOR DE PRESET -->
        <ha-form
          .hass=${this._hass}
          .data=${{ preset }}
          .schema=${this._presetSchema()}
          .computeLabel=${this._computePresetLabel}
          @value-changed=${this._handlePresetChanged}
        ></ha-form>

        <!-- SECCIÓN DE COLORES MANUALES -->
        ${preset === "custom" ? b`
          <div class="gradient-section">

            <div class="gradient-preview-wrap">
              <div class="gradient-preview" style="background:${gradientPreview}"></div>
              <div class="gradient-preview-label">Vista previa del degradado</div>
            </div>

            ${this._renderColorRow("Color superior", "color_start", data.color_start_rgb, data.color_start_alpha)}

            <!-- Color medio (opcional) -->
            ${data.has_mid ? this._renderColorRow("Color medio", "color_mid", data.color_mid_rgb, data.color_mid_alpha, {
			removable: true,
			midPos: data.color_mid_pos
		}) : b`
                <button class="btn-add-mid" @click=${this._toggleMidColor}>
                  <span class="btn-add-mid-icon">+</span>
                  Añadir color intermedio
                </button>
              `}

            ${this._renderColorRow("Color inferior", "color_end", data.color_end_rgb, data.color_end_alpha)}

            <ha-form
              .hass=${this._hass}
              .data=${{ angle: data.angle }}
              .schema=${this._angleSchema()}
              .computeLabel=${this._computeAngleLabel}
              @value-changed=${this._handleAngleChanged}
            ></ha-form>
          </div>
        ` : A}

        <!-- BARRA DE PESTAÑAS Y NAVEGACIÓN -->
        <div class="toolbar">
          <ha-tab-group .active=${String(selected)} @tab-changed=${this._handleSelectedCard}>
            ${cards.map((_card, i) => b`
                <ha-tab-group-tab .active=${selected === i} .name=${String(i)}>
                  ${i + 1}
                </ha-tab-group-tab>
              `)}
            <ha-tab-group-tab .active=${isAdding} .name=${String(numCards)}>
              <ha-icon .path=${mdiPlus}></ha-icon>
            </ha-tab-group-tab>
          </ha-tab-group>
        </div>

        <!-- CONTENIDO DEL EDITOR -->
        ${isAdding ? b`
              <div id="editor">
                ${hasClipboard ? b`
                      <div class="paste-bar">
                        <button class="btn-paste" @click=${this._handlePasteCard}>
                          <ha-icon .path=${mdiContentPaste}></ha-icon>
                          Pegar tarjeta del portapapeles
                        </button>
                      </div>
                    ` : A}
                <hui-card-picker
                  .hass=${this._hass}
                  .lovelace=${this._effectiveLovelace}
                  @config-changed=${this._handleCardPicked}
                ></hui-card-picker>
              </div>
            ` : numCards > 0 ? b`
                <div id="card-options">
                  <ha-icon-button
                    .path=${mdiChevronLeft}
                    .label=${"Mover a la izquierda"}
                    .disabled=${selected === 0}
                    @click=${() => this._handleMove(-1)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiChevronRight}
                    .label=${"Mover a la derecha"}
                    .disabled=${selected >= numCards - 1}
                    @click=${() => this._handleMove(1)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiContentCopy}
                    .label=${(_this$_hass$localize4 = (_this$_hass$localize5 = (_this$_hass3 = this._hass).localize) === null || _this$_hass$localize5 === void 0 ? void 0 : _this$_hass$localize5.call(_this$_hass3, "ui.common.copy")) !== null && _this$_hass$localize4 !== void 0 ? _this$_hass$localize4 : "Copiar"}
                    @click=${this._handleCopyCard}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiContentCut}
                    .label=${(_this$_hass$localize6 = (_this$_hass$localize7 = (_this$_hass4 = this._hass).localize) === null || _this$_hass$localize7 === void 0 ? void 0 : _this$_hass$localize7.call(_this$_hass4, "ui.common.cut")) !== null && _this$_hass$localize6 !== void 0 ? _this$_hass$localize6 : "Cortar"}
                    @click=${this._handleCutCard}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiDelete}
                    .label=${(_this$_hass$localize8 = (_this$_hass$localize9 = (_this$_hass5 = this._hass).localize) === null || _this$_hass$localize9 === void 0 ? void 0 : _this$_hass$localize9.call(_this$_hass5, "ui.common.delete")) !== null && _this$_hass$localize8 !== void 0 ? _this$_hass$localize8 : "Eliminar"}
                    @click=${this._handleDeleteCard}
                  ></ha-icon-button>
                </div>

                <div id="editor">
                  <hui-card-element-editor
                    .hass=${this._hass}
                    .lovelace=${this._effectiveLovelace}
                    .value=${cards[selected]}
                    @config-changed=${this._handleCardConfigChanged}
                  ></hui-card-element-editor>
                </div>
              ` : A}
      </div>
    `;
	}
	static get styles() {
		return [i$3`
        .card-config {
          overflow: auto;
        }

        ha-form {
          display: block;
        }

        /* ── Sección de colores manuales ── */
        .gradient-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 2px;
          margin-bottom: 16px;
        }

        /* Barra de preview del degradado */
        .gradient-preview-wrap {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--divider-color);
        }
        .gradient-preview {
          height: 56px;
          width: 100%;
          transition: background 0.35s ease;
        }
        .gradient-preview-label {
          font-size: 0.72em;
          color: var(--secondary-text-color);
          text-align: center;
          padding: 4px 0;
          background: var(--secondary-background-color);
          letter-spacing: 0.03em;
        }

        /* ── Fila de color ── */
        .color-row {
          background: var(--secondary-background-color);
          border: 1px solid var(--divider-color);
          border-radius: 10px;
          overflow: hidden;
        }
        .color-row-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px 8px;
          border-bottom: 1px solid var(--divider-color);
        }
        .color-row-label {
          font-size: 0.85em;
          font-weight: 600;
          color: var(--primary-text-color);
          letter-spacing: 0.02em;
        }
        .color-row-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* Botón quitar color medio */
        .btn-remove-mid {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid var(--error-color, #f44336);
          background: transparent;
          color: var(--error-color, #f44336);
          font-size: 0.8em;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .btn-remove-mid:hover {
          background: var(--error-color, #f44336);
          color: #fff;
        }
        /* Botón añadir color intermedio */
        .btn-add-mid {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          background: transparent;
          border: 1.5px dashed var(--divider-color);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--secondary-text-color);
          font-size: 0.85em;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
        }
        .btn-add-mid:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          background: color-mix(in srgb, var(--primary-color) 6%, transparent);
        }
        .btn-add-mid-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          font-size: 1.1em;
          line-height: 1;
          flex-shrink: 0;
        }

        /* Swatch circular con patrón de ajedrez para transparencia */
        .color-swatch-wrap {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--divider-color);
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .checker-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(45deg, #aaa 25%, transparent 25%),
            linear-gradient(-45deg, #aaa 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #aaa 75%),
            linear-gradient(-45deg, transparent 75%, #aaa 75%);
          background-color: #fff;
          background-size: 7px 7px;
          background-position: 0 0, 0 3.5px, 3.5px -3.5px, -3.5px 0;
        }
        .color-swatch {
          position: absolute;
          inset: 0;
          transition: background 0.2s ease;
        }

        .color-row-body {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        ha-selector {
          display: block;
        }

        /* ── Slider de opacidad ── */
        .alpha-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .alpha-label {
          font-size: 0.78em;
          color: var(--secondary-text-color);
          white-space: nowrap;
          min-width: 54px;
        }
        .alpha-slider-wrap {
          position: relative;
          flex: 1;
          height: 20px;
          display: flex;
          align-items: center;
        }
        /* Pista: checker base + overlay con el gradiente de color */
        .alpha-track {
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          border-radius: 4px;
          pointer-events: none;
          /* checker base */
          background-image:
            linear-gradient(45deg, #bbb 25%, transparent 25%),
            linear-gradient(-45deg, #bbb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #bbb 75%),
            linear-gradient(-45deg, transparent 75%, #bbb 75%),
            var(--alpha-gradient, linear-gradient(to right, transparent, grey));
          background-color: #fff;
          background-size: 8px 8px, 8px 8px, 8px 8px, 8px 8px, 100% 100%;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0, 0 0;
        }
        .alpha-slider {
          position: relative;
          width: 100%;
          height: 8px;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          z-index: 1;
        }
        .alpha-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--card-background-color, #fff);
          border: 2.5px solid var(--primary-color);
          box-shadow: 0 1px 5px rgba(0,0,0,0.28);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .alpha-slider::-webkit-slider-thumb:hover {
          transform: scale(1.18);
          box-shadow: 0 2px 9px rgba(0,0,0,0.32);
        }
        .alpha-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--card-background-color, #fff);
          border: 2.5px solid var(--primary-color);
          box-shadow: 0 1px 5px rgba(0,0,0,0.28);
          cursor: pointer;
        }
        .alpha-value {
          font-size: 0.8em;
          font-weight: 600;
          color: var(--primary-text-color);
          min-width: 34px;
          text-align: right;
        }

        /* ── Toolbar y editor de tarjetas ── */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          margin-top: 4px;
        }
        ha-tab-group {
          flex-grow: 1;
          min-width: 0;
          --ha-tab-track-color: var(--card-background-color);
        }
        #card-options {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          gap: 4px;
          margin-bottom: 8px;
        }
        #editor {
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          padding: 12px;
          background: var(--secondary-background-color);
        }
        .paste-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        .btn-paste {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-color);
          color: var(--text-primary-color, #fff);
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-weight: bold;
          cursor: pointer;
        }
        .btn-paste:hover {
          opacity: 0.9;
        }
        @media (max-width: 450px) {
          #editor {
            margin: 0 -12px;
          }
        }
      `];
	}
};
//#endregion
//#region src/index.ts
if (!customElements.get("styled-stack-card")) customElements.define("styled-stack-card", StyledStackCard);
if (!customElements.get("styled-stack-card-editor")) customElements.define("styled-stack-card-editor", StyledStackCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "styled-stack-card")) window.customCards.push({
	type: "styled-stack-card",
	name: "Styled Stack Card",
	preview: true,
	description: "Un contenedor personalizado con degradados y temas visuales para tus tarjetas."
});
console.info("%c STYLED-STACK-CARD %c Cargada correctamente ", "color: white; background: #1db954; font-weight: 700;", "color: black; background: #f3f3f3; font-weight: 700;");
//#endregion
