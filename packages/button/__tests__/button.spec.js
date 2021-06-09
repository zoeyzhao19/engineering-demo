import { ElButton } from 'main/entry'
import { mount } from '@vue/test-utils'

it("content", () => {
  const comp = {
    template: `<div><el-button>默认按钮</el-button></div>`
  }
  const wrapper = mount(comp, {
    global: {
      components: {
        ElButton
      }
    }
  })
  expect(wrapper.findComponent({name: 'ElButton'}).text()).toContain('默认按钮')
})

describe("size", () => {
  it("should have a el-button--mini class when set size prop value equal to mini", () => {
    const wrapper = mount(ElButton, {
      props: {
        size: 'mini'
      }
    })
    expect(wrapper.classes()).toContain("el-button--mini")
  })

  it("should have a el-button--mini class by elFormItem", () => {
    const wrapper = mount(ElButton, {
      global: {
        provide: {
          elFormItem: {
            elFormItemSize: "mini",
          }
        }
      }
    })
    expect(wrapper.classes()).toContain("el-button--mini")
  })
})

it("primary", () => {
  const wrapper = mount(ElButton, {
    props: {
      type: 'primary'
    }
  })
  expect(wrapper.classes()).toContain("el-button--primary")
})

it("plain", () => {
  const wrapper = mount(ElButton, {
    props: {
      plain: true
    }
  })
  expect(wrapper.classes()).toContain("is-plain")
})

it("round", () => {
  const wrapper = mount(ElButton, {
    props: {
      round: true,
    }
  })
  expect(wrapper.classes()).toContain("is-round")
})

it("round", () => {
  const wrapper = mount(ElButton, {
    props: {
      circle: true,
    }
  })
  expect(wrapper.classes()).toContain("is-circle")
})

it("loading", () => {
  const wrapper = mount(ElButton, {
    props: {
      loading: true,
    }
  })
  expect(wrapper.find(".el-icon-loading").exists()).toBe(true)
  expect(wrapper.classes()).toContain("is-loading")
})

describe("icon", () => {
  it("should show icon element", () => {
    const wrapper = mount(ElButton, {
      props: {
        icon: "el-icon-edit"
      }
    })
    expect(wrapper.find(".el-icon-edit").exists()).toBe(true)
  })

  it("should not show icon element when set loading prop equal to true", () => {
    const wrapper = mount(ElButton, {
      props: {
        loading: true,
        icon: "el-icon-edit"
      }
    })
    expect(wrapper.find(".el-icon-edit").exists()).toBe(false)
  })
})

describe("click", () => {
  it("should emit click event", () => {
    const wrapper = mount(ElButton)
    wrapper.trigger("click")
    expect(wrapper.emitted("click")).toBeTruthy()
  })

  it("should not emit click event when disabled equal to true", () => {
    const wrapper = mount(ElButton, {
      props: {
        disabled: true
      }
    })
    wrapper.trigger("click")
    expect(wrapper.emitted("click")).toBeFalsy()
  })

  it("should not emit click event when elForm disabled equal to true", () => {
    const wrapper = mount(ElButton, {
      global: {
        provide: {
          elForm: {
            disabled: true
          }
        }
      }
    })
    wrapper.trigger("click")
    expect(wrapper.emitted("click")).toBeFalsy()
  })

  it("should not emit click event when loading prop equal to true", () => {
    const wrapper = mount(ElButton, {
      props: {
        loading: true
      }
    })
    wrapper.trigger("click")
    expect(wrapper.emitted("click")).toBeFalsy()
  })
})

it("native-type", () => {
  const wrapper = mount(ElButton, {
    props: {
      nativeType: "button"
    }
  })
  expect(wrapper.attributes("type")).toBe("button")
})