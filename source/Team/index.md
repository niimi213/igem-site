---
title: Team
date: 2021-08-20 12:24:16
---

## Members

<section class="gallery" id="team-gallery">
  <gallery-item face="/assets/team/face1.png" name="Rintaro Shimojo"></gallery-item>
  <gallery-item face="/assets/team/face2.png" name="Ayumu Hyodo"></gallery-item>
  <gallery-item face="/assets/team/face3.png" name="Rintaro Shimojo"></gallery-item>
  <gallery-item face="/assets/team/face4.png" name="Ayumu Hyodo"></gallery-item>
  <gallery-item face="/assets/team/face5.png" name="Rintaro Shimojo"></gallery-item>
  <gallery-item face="/assets/team/face6.png" name="Ayumu Hyodo"></gallery-item>
  <gallery-item face="/assets/team/face7.png" name="Rintaro Shimojo"></gallery-item>
  <gallery-item face="/assets/team/face8.png" name="Ayumu Hyodo"></gallery-item>
</section>

<script>
const transforms = {
  // top
  0: 'translateY(-100%)',
  // right
  1: 'translateX(100%)',
  // bottom
  2: 'translateY(100%)',
  // left
  3: 'translateX(-100%)',
}
Vue.component('gallery-item', {
  props: {
    face: String,
    name: String
  },
  template: `
<div class="gallery-item" @mouseenter="enter" @mouseleave="leave" ref="item">
  <div class="face" :style="{ backgroundImage: \`url('\${face}')\` }">
    <div class="sushi" ref="sushi">
      <img src="/assets/team/sushi/maguro.svg" />
      Maguro
    </div>
  </div>
  <h3>\{\{ name \}\}</h3>
  <p class="profile-bio">
    College of Arts and Sciences, Year 1
  </p>
  <p class="profile-bio">
    Appeared in wiki draft
  </p>
  <p class="profile-voice">
    Figma no default ni haitte itayo.<br />
    I think dogs are as cute as cats.
  </p>
</div>
`,
  methods: {
    enter(e) {
      this.animate(e)
    },
    leave(e) {
      this.animate(e, true)
    },
    animate(e, isReverse = false) {
      const rect = this.$refs.item.getBoundingClientRect()
      const distances = [e.offsetY, rect.width - e.offsetX, rect.height - e.offsetY, e.offsetX]
      const edge = distances.indexOf(Math.min(...distances))
      // if we use `reverse` option, easing will also be reversed, and the animation will be awkward.
      const transition = !isReverse ? [transforms[edge], 'none'] : ['none', transforms[edge]]
      this.$refs.sushi.animate({
        transform: transition
      }, {
        duration: 500,
        easing: 'ease',
        fill: 'forwards'
      })
    }
  }
})
new Vue({ el: '#team-gallery' })
</script>

