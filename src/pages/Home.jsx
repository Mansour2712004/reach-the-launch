useEffect(() => {
    (async () => {
      try {
        const [l, d] = await Promise.all([getAllLaunches(), getAllDevelopers()])
        setLaunches(l)
        setDevelopers(d)
      } catch (e) {
        console.error('Failed to load home data', e)
      } finally {
        setLoading(false)
      }

      try {
        setOffer(await getSpecialOffer())
      } catch (e) {
        console.error('Failed to load special offer', e)
      }
    })()
  }, [])
